/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (apiDef, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return checkMajorVersion(apiDef);
};

// Check:
// - Each url in the servers object has a path segment of the form v followed by a number,
//   and the number is the same for all urls, or
// - Each path has a path segment of the form v followed by a number, and the number is
//   the same for all paths
function checkMajorVersion(apiDef) {
  if (apiDef === null || typeof apiDef !== 'object') {
    return [];
  }

  const oas3 = apiDef['openapi'];

  if (oas3) {
    logger.debug(`${ruleId}: detected OAS3 document!`);
    const servers = apiDef['servers'];
    if (servers && Array.isArray(servers)) {
      // Gather up all the unique path segments that
      // indicate the API major version (e.g. /v1) within
      // the URLs defined in the servers list.
      const versions = [];
      for (let i = 0; i < servers.length; i++) {
        // Obtain the URL string from the server entry by resolving any
        // variable references with each variable's default value.
        const url = getDefaultUrl(servers[i]);
        if (url) {
          try {
            const version = getVersion(url);
            if (version) {
              versions.push(version);
            }
          } catch (error) {
            // Ignore any exceptions while parsing the URL string.
          }
        }
      }

      // If we have more than one unique "version" segment, then flag it.
      if (versions.length > 1 && !versions.every(v => v === versions[0])) {
        const uniqueVersions = versions.filter(
          (val, i, self) => self.indexOf(val) === i
        );
        logger.debug(
          `${ruleId}: detected multiple unique URL major version segments in servers list: ${uniqueVersions.join(
            ', '
          )}`
        );
        return [
          {
            message:
              'Major version segments of urls in servers object do not match. Found: ' +
              uniqueVersions.join(', '),
            path: ['servers'],
          },
        ];
      }

      if (versions.length >= 1 && versions[0]) {
        // Major version present in server URL and all match -- all good
        logger.debug(
          `${ruleId}: detected matching URL major version segments in servers list: ${versions[0]}`
        );
        return [];
      }
    }
  } else {
    // oas2
    logger.debug(`${ruleId}: detected Swagger 2 document!`);

    const basePath = apiDef['basePath'] || '';
    const version = getVersion(basePath);
    if (version) {
      return [];
    }
  }

  // We did not find a major version in server URLs, so now check the paths
  logger.debug(
    `${ruleId}: checking for major version segments in path strings`
  );

  const paths = apiDef['paths'];
  if (paths && typeof paths === 'object') {
    const urls = Object.keys(paths);

    if (!urls.length) {
      logger.debug(`${ruleId}: no path strings to check - "paths" is empty`);

      return [];
    }

    const versions = urls.map(url => getVersion(url));

    if (versions.length > 1 && !versions.every(v => v === versions[0])) {
      const uniqueVersions = versions.filter(
        (val, i, self) => self.indexOf(val) === i
      );
      logger.debug(
        `${ruleId}: detected multiple unique major version segments in paths: ${uniqueVersions.join(
          ', '
        )}`
      );
      return [
        {
          message:
            'Major version segments in paths do not match. Found: ' +
            uniqueVersions.join(', '),
          path: ['paths'],
        },
      ];
    }

    if (versions.length >= 1 && versions[0]) {
      // Major version present in server URL and all match -- all good
      logger.debug(
        `${ruleId}: detected matching major version segments in paths: ${versions[0]}`
      );
      return [];
    }
  }

  if (oas3) {
    logger.debug(
      `${ruleId}: no major version segments detected in servers field or paths object!`
    );
    return [
      {
        message:
          'Major version segment not present in either server URLs or paths',
      },
    ];
  } else {
    logger.debug(
      `${ruleId}: no major version segments detected in basePath field or paths object!`
    );
    return [
      {
        message:
          'Major version segment not present in either basePath or paths',
      },
    ];
  }
}

/**
 * Returns the first segment of the path portion of "urlString" that matches the pattern 'v\d+'
 * @param {*} urlString an absolute or relative URL string (e.g. "https://myhost.com/api/v1" or "/v1/clouds").
 * @returns the first path segment that appears to indicate the API major version (e.g. "v1").
 */
function getVersion(urlString) {
  const url = new URL(urlString, 'https://foo.bar');
  const segments = url.pathname.split('/');
  return segments.find(segment => segment.match(/v[0-9]+/));
}

/**
 * Returns the "default" server URL for the specified server object.
 *
 * @param {object} server an entry from the API definition's "servers" list.
 * @returns the default URL string which is the result of replacing server
 * variable references found in the server object's "url" field with
 * the default value for each referenced server variable.
 */
function getDefaultUrl(server) {
  let urlString = null;
  if (server && server.url) {
    urlString = server.url;

    if (server.variables) {
      for (const variable of Object.entries(server.variables)) {
        const varName = variable[0];
        const varObj = variable[1];
        if (varName && varObj && varObj.default) {
          const varRefRE = new RegExp('{' + varName + '}', 'g');
          urlString = urlString.replace(varRefRE, varObj.default);
        }
      }
    }
  }

  return urlString;
}
