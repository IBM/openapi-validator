// Check:
// - Each url in the servers object has a path segment of the form v followed by a number,
//   and the number is the same for all urls, or
// - Each path has a path segment of the form v followed by a number, and the number is
//   the same for all paths

module.exports = targetVal => {
  if (targetVal === null || typeof targetVal !== 'object') {
    return;
  }

  const oas3 = targetVal['openapi'];

  if (oas3) {
    const servers = targetVal['servers'];
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
        return [
          {
            message:
              'Major version segments of urls in servers object do not match. Found ' +
              uniqueVersions.join(', '),
            path: ['servers']
          }
        ];
      }

      if (versions.length >= 1 && versions[0]) {
        // Major version present in server URL and all match -- all good
        return;
      }
    }
  } else {
    // oas2
    const basePath = targetVal['basePath'] || '';
    const version = getVersion(basePath);
    if (version) {
      return;
    }
  }

  // We did not find a major version in server URLs, so now check the paths

  const paths = targetVal['paths'];
  if (paths && typeof paths === 'object') {
    const urls = Object.keys(paths);
    const versions = urls.map(url => getVersion(url));

    if (versions.length > 1 && !versions.every(v => v === versions[0])) {
      const uniqueVersions = versions.filter(
        (val, i, self) => self.indexOf(val) === i
      );
      return [
        {
          message:
            'Major version segments of paths object do not match. Found ' +
            uniqueVersions.join(', '),
          path: ['paths']
        }
      ];
    }

    if (versions.length >= 1 && versions[0]) {
      // Major version present in server URL and all match -- all good
      return;
    }
  }

  if (oas3) {
    return [
      {
        message:
          'Major version segment not present in either server URLs or paths'
      }
    ];
  } else {
    return [
      {
        message: 'Major version segment not present in either basePath or paths'
      }
    ];
  }
};

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
