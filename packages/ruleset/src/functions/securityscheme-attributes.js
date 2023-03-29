/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const stringValidator = require('validator');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (securityScheme, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return checkSecuritySchemeAttributes(
    securityScheme,
    context.path,
    context.document
  );
};

const API_KEY = 'apiKey';
const OAUTH2 = 'oauth2';
const HTTP = 'http';
const OPENID_CONNECT = 'openIdConnect';
const validTypes = [API_KEY, HTTP, OAUTH2, OPENID_CONNECT];
const validIns = ['query', 'header', 'cookie'];

/**
 * This function will perform various checks to ensure that a securityScheme object is well-formed.
 * Here is a summary:
 * 1: 'type' is required and must be one of : apiKey, http, oauth2, openIdConnect`
 * 2: 'name' is required for apiKey type
 * 3: 'in' is required for apiKey type and must be one of: query, header or cookie
 * 4: 'scheme' is required for http type
 * 5: 'flows' object is required for oauth2 type
 * 6: 'openIdConnectUrl' is required for openIdConnect type and must be a valid url
 *
 * Reference:
 * https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#security-scheme-object
 *
 * @param {*} securityScheme the securityScheme object to be checked
 * @param {*} path the array of path segments indicating the "location" of the securityScheme within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function checkSecuritySchemeAttributes(securityScheme, path, doc) {
  logger.debug(
    `${ruleId}: checking securityScheme at location; ${path.join('.')}`
  );

  const errors = [];
  const serviceUrl = getServiceUrl(doc);
  const type = securityScheme.type;

  if (!type) {
    errors.push({
      message: `Security scheme is missing required property: type`,
      path,
    });
  } else if (!validTypes.includes(type)) {
    errors.push({
      message: `Security scheme property 'type' must be one of: ${validTypes.join(
        ', '
      )}`,
      path: [...path, 'type'],
    });
  } else if (type === HTTP) {
    // http validation
    if (!securityScheme.scheme) {
      errors.push({
        message: `Security scheme with type '${HTTP}' is missing required property: scheme`,
        path,
      });
    }
  } else if (type === API_KEY) {
    // apiKey validation
    const authIn = securityScheme.in;
    if (!authIn) {
      errors.push({
        message: `Security scheme with type '${API_KEY}' is missing required property: in`,
        path,
      });
    } else if (!validIns.includes(authIn)) {
      errors.push({
        message: `Security scheme property 'in' must be one of: ${validIns.join(
          ', '
        )}`,
        path: [...path, 'in'],
      });
    }

    if (!securityScheme.name) {
      errors.push({
        message: `Security scheme with type '${API_KEY}' is missing required property: name`,
        path,
      });
    }
  } else if (type == OPENID_CONNECT) {
    // openIdConnect validation
    const openIdConnectUrl = securityScheme.openIdConnectUrl;
    if (!openIdConnectUrl) {
      errors.push({
        message: `Security scheme with type '${OPENID_CONNECT}' is missing required property: openIdConnectUrl`,
        path,
      });
    } else if (!isValidUrl(openIdConnectUrl, serviceUrl)) {
      errors.push({
        message: `Security scheme property 'openIdConnectUrl' must be a valid URL`,
        path: [...path, 'openIdConnectUrl'],
      });
    }
  } else if (type === OAUTH2) {
    // oauth2 validation
    const flows = securityScheme.flows;
    if (!flows) {
      errors.push({
        message: `Security scheme with type '${OAUTH2}' is missing required property: flows`,
        path,
      });
    } else {
      // Validate the flows object.

      // At least one flow type must be specified.
      if (
        !flows.implicit &&
        !flows.authorizationCode &&
        !flows.password &&
        !flows.clientCredentials
      ) {
        errors.push({
          message: `oauth2 flow object must specify one or more of the following properties: implicit, password, clientCredentials or authorizationCode`,
          path: [...path, 'flows'],
        });
      }

      // Validate "authorizationCode" type flow.
      let flow = flows.authorizationCode;
      if (flow) {
        if (!flow.tokenUrl) {
          errors.push({
            message: `oauth2 'authorizationCode' flow is missing required property: tokenUrl`,
            path: [...path, 'flows', 'authorizationCode'],
          });
        } else if (!isValidUrl(flow.tokenUrl, serviceUrl)) {
          errors.push({
            message: `Security scheme property 'tokenUrl' must be a valid URL`,
            path: [...path, 'flows', 'authorizationCode', 'tokenUrl'],
          });
        }

        if (!flow.authorizationUrl) {
          errors.push({
            message: `oauth2 'authorizationCode' flow is missing required property: authorizationUrl`,
            path: [...path, 'flows', 'authorizationCode'],
          });
        } else if (!isValidUrl(flow.authorizationUrl, serviceUrl)) {
          errors.push({
            message: `Security scheme property 'authorizationUrl' must be a valid URL`,
            path: [...path, 'flows', 'authorizationCode', 'authorizationUrl'],
          });
        }

        if (!flow.scopes) {
          errors.push({
            message: `oauth2 'authorizationCode' flow is missing required property: scopes`,
            path: [...path, 'flows', 'authorizationCode'],
          });
        }
      }

      // Validate "password" type flow.
      flow = flows.password;
      if (flow) {
        if (!flow.tokenUrl) {
          errors.push({
            message: `oauth2 'password' flow is missing required property: tokenUrl`,
            path: [...path, 'flows', 'password'],
          });
        } else if (!isValidUrl(flow.tokenUrl, serviceUrl)) {
          errors.push({
            message: `Security scheme property 'tokenUrl' must be a valid URL`,
            path: [...path, 'flows', 'password', 'tokenUrl'],
          });
        }

        if (!flow.scopes) {
          errors.push({
            message: `oauth2 'password' flow is missing required property: scopes`,
            path: [...path, 'flows', 'password'],
          });
        }
      }

      // Validate "clientCredentials" type flow.
      flow = flows.clientCredentials;
      if (flow) {
        if (!flow.tokenUrl) {
          errors.push({
            message: `oauth2 'clientCredentials' flow is missing required property: tokenUrl`,
            path: [...path, 'flows', 'clientCredentials'],
          });
        } else if (!isValidUrl(flow.tokenUrl, serviceUrl)) {
          errors.push({
            message: `Security scheme property 'tokenUrl' must be a valid URL`,
            path: [...path, 'flows', 'clientCredentials', 'tokenUrl'],
          });
        }

        if (!flow.scopes) {
          errors.push({
            message: `oauth2 'clientCredentials' flow is missing required property: scopes`,
            path: [...path, 'flows', 'clientCredentials'],
          });
        }
      }

      // Validate "implicit" type flow.
      flow = flows.implicit;
      if (flow) {
        if (!flow.authorizationUrl) {
          errors.push({
            message: `oauth2 'implicit' flow is missing required property: authorizationUrl`,
            path: [...path, 'flows', 'implicit'],
          });
        } else if (!isValidUrl(flow.authorizationUrl, serviceUrl)) {
          errors.push({
            message: `Security scheme property 'authorizationUrl' must be a valid URL`,
            path: [...path, 'flows', 'implicit', 'authorizationUrl'],
          });
        }

        if (!flow.scopes) {
          errors.push({
            message: `oauth2 'implicit' flow is missing required property: scopes`,
            path: [...path, 'flows', 'implicit'],
          });
        }
      }
    }
  }

  if (errors.length) {
    logger.debug(
      `${ruleId}: found these errors:\n${JSON.stringify(errors, null, 2)}`
    );
  } else {
    logger.debug(`${ruleId}: PASSED!`);
  }

  return errors;
}

function getServiceUrl(doc) {
  const openapi = doc.parserResult.data;
  if (openapi.servers && openapi.servers.length > 0) {
    return openapi.servers[0].url;
  }

  return '';
}

function isValidUrl(url, serviceUrl) {
  if (typeof url !== 'string') {
    return false;
  }

  // the openapi spec allows url properties to be relative to the url in "servers"
  if (url.startsWith('/')) {
    if (serviceUrl.endsWith('/')) {
      url = serviceUrl + url.slice(1);
    } else {
      url = serviceUrl + url;
    }
  }

  return stringValidator.isURL(url);
}
