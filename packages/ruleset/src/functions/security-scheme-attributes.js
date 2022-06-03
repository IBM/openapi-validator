const stringValidator = require('validator');

module.exports = function(securityScheme, _opts, { path }) {
  return checkSecuritySchemeAttributes(securityScheme, path);
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
 * @param {*} securityScheme the securitySchema object to be checked
 * @param {*} path the array of path segments indicating the "location" of the securitySchema within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function checkSecuritySchemeAttributes(securityScheme, path) {
  const errors = [];

  const type = securityScheme.type;

  if (!type) {
    errors.push({
      message: `security scheme is missing required property: type`,
      path
    });
  } else if (!validTypes.includes(type)) {
    errors.push({
      message: `security scheme 'type' property must be one of: ${validTypes.join(
        ', '
      )}`,
      path: [...path, 'type']
    });
  } else if (type === HTTP) {
    // http validation
    if (!securityScheme.scheme) {
      errors.push({
        message: `security scheme with type '${HTTP}' is missing required property: scheme`,
        path
      });
    }
  } else if (type === API_KEY) {
    // apiKey validation
    const authIn = securityScheme.in;
    if (!authIn) {
      errors.push({
        message: `security scheme with type '${API_KEY}' is missing required property: in`,
        path
      });
    } else if (!validIns.includes(authIn)) {
      errors.push({
        message: `security scheme 'in' property must be one of: ${validIns.join(
          ', '
        )}`,
        path: [...path, 'in']
      });
    }

    if (!securityScheme.name) {
      errors.push({
        message: `security scheme with type '${API_KEY}' is missing required property: name`,
        path
      });
    }
  } else if (type == OPENID_CONNECT) {
    // openIdConnect validation
    const openIdConnectUrl = securityScheme.openIdConnectUrl;
    if (!openIdConnectUrl) {
      errors.push({
        message: `security scheme with type '${OPENID_CONNECT}' is missing required property: openIdConnectUrl`,
        path
      });
    } else if (
      typeof openIdConnectUrl !== 'string' ||
      !stringValidator.isURL(openIdConnectUrl)
    ) {
      errors.push({
        message: `security scheme 'openIdConnectUrl' property must be a valid URL`,
        path: [...path, 'openIdConnectUrl']
      });
    }
  } else if (type === OAUTH2) {
    // oauth2 validation
    const flows = securityScheme.flows;
    if (!flows) {
      errors.push({
        message: `security scheme with type '${OAUTH2}' is missing required property: flows`,
        path
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
          path: [...path, 'flows']
        });
      }

      // Validate "authorizationCode" type flow.
      let flow = flows.authorizationCode;
      if (flow) {
        if (!flow.tokenUrl) {
          errors.push({
            message: `oauth2 'authorizationCode' flow is missing required property: tokenUrl`,
            path: [...path, 'flows', 'authorizationCode']
          });
        } else if (
          typeof flow.tokenUrl !== 'string' ||
          !stringValidator.isURL(flow.tokenUrl)
        ) {
          errors.push({
            message: `security scheme 'tokenUrl' property must be a valid URL`,
            path: [...path, 'flows', 'authorizationCode', 'tokenUrl']
          });
        }

        if (!flow.authorizationUrl) {
          errors.push({
            message: `oauth2 'authorizationCode' flow is missing required property: authorizationUrl`,
            path: [...path, 'flows', 'authorizationCode']
          });
        } else if (
          typeof flow.authorizationUrl !== 'string' ||
          !stringValidator.isURL(flow.authorizationUrl)
        ) {
          errors.push({
            message: `security scheme 'authorizationUrl' property must be a valid URL`,
            path: [...path, 'flows', 'authorizationCode', 'authorizationUrl']
          });
        }

        if (!flow.scopes) {
          errors.push({
            message: `oauth2 'authorizationCode' flow is missing required property: scopes`,
            path: [...path, 'flows', 'authorizationCode']
          });
        }
      }

      // Validate "password" type flow.
      flow = flows.password;
      if (flow) {
        if (!flow.tokenUrl) {
          errors.push({
            message: `oauth2 'password' flow is missing required property: tokenUrl`,
            path: [...path, 'flows', 'password']
          });
        } else if (
          typeof flow.tokenUrl !== 'string' ||
          !stringValidator.isURL(flow.tokenUrl)
        ) {
          errors.push({
            message: `security scheme 'tokenUrl' property must be a valid URL`,
            path: [...path, 'flows', 'password', 'tokenUrl']
          });
        }

        if (!flow.scopes) {
          errors.push({
            message: `oauth2 'password' flow is missing required property: scopes`,
            path: [...path, 'flows', 'password']
          });
        }
      }

      // Validate "clientCredentials" type flow.
      flow = flows.clientCredentials;
      if (flow) {
        if (!flow.tokenUrl) {
          errors.push({
            message: `oauth2 'clientCredentials' flow is missing required property: tokenUrl`,
            path: [...path, 'flows', 'clientCredentials']
          });
        } else if (
          typeof flow.tokenUrl !== 'string' ||
          !stringValidator.isURL(flow.tokenUrl)
        ) {
          errors.push({
            message: `security scheme 'tokenUrl' property must be a valid URL`,
            path: [...path, 'flows', 'clientCredentials', 'tokenUrl']
          });
        }

        if (!flow.scopes) {
          errors.push({
            message: `oauth2 'clientCredentials' flow is missing required property: scopes`,
            path: [...path, 'flows', 'clientCredentials']
          });
        }
      }

      // Validate "implicit" type flow.
      flow = flows.implicit;
      if (flow) {
        if (!flow.authorizationUrl) {
          errors.push({
            message: `oauth2 'implicit' flow is missing required property: authorizationUrl`,
            path: [...path, 'flows', 'implicit']
          });
        } else if (
          typeof flow.authorizationUrl !== 'string' ||
          !stringValidator.isURL(flow.authorizationUrl)
        ) {
          errors.push({
            message: `security scheme 'authorizationUrl' property must be a valid URL`,
            path: [...path, 'flows', 'implicit', 'authorizationUrl']
          });
        }

        if (!flow.scopes) {
          errors.push({
            message: `oauth2 'implicit' flow is missing required property: scopes`,
            path: [...path, 'flows', 'implicit']
          });
        }
      }
    }
  }

  return errors;
}
