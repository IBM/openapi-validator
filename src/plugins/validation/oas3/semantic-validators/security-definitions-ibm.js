// Assertation 1: `type`` is a necessary property and has four possible values: `apiKey`, `HTTP`, `oauth2`, `openIdConnect`
// Assertation 2: name property is required for `apiKey` type
// Assertation 3: `in` property is required for `apiKey` type, valid values are: `query`, `header`` or `cookie`
// Assertation 4: `scheme` property` is required for `http` type
// Assertation 5: `flows` object is required for `oauth2`` type
// Assertation 6: `opedIdConnectUrl` property is required for `openIdConnect` and must be a valid url

const validator = require('validator');
module.exports.validate = function({ resolvedSpec }) {
  console.log(JSON.stringify(resolvedSpec, null, 2));
  const API_KEY = 'apiKey';
  const OAUTH2 = 'oauth2';
  const HTTP = 'http';
  const OPENID_CONNECT = 'openIdConnect';
  const auths = [API_KEY, HTTP, OAUTH2, OPENID_CONNECT];
  const PASSWORD = 'password';
  const CLIENT_CREDENTIALS = 'client_Credentials';
  const AUTHORIZATION_CODE = 'authorizationCode';
  const errors = [];
  const warnings = [];
  const securitySchemes = resolvedSpec.components.securitySchemes;

  for (const key in securitySchemes) {
    const security = securitySchemes[key];
    const type = security.type;
    const path = `securitySchemes.${key}`;

    if (!type) {
      errors.push({
        message: `'type' must be defined as a string and is required for path: ${path}`,
        path,
        authId: key
      });
    } else if (auths.indexOf(type) === -1) {
      errors.push({
        message:
          '`type` must have one of the following types: `apiKey`, `oauth2`, `http`, `openIdConnect`',
        path,
        authId: key
      });
    } else {
      //apiKey validation
      if (type === API_KEY) {
        const authIn = security.in;
        if (!authIn) {
          errors.push({
            message:
              "apiKey authorization must have required 'in' property, valid values are 'query' or 'header' or 'cookie'.",
            path,
            authId: key
          });
        } else if (
          authIn !== 'query' &&
          authIn !== 'header' &&
          authIn != 'cookie'
        ) {
          errors.push({
            message:
              "apiKey authorization must have required 'in' property, valid values are 'query' or 'header' or 'cookie'.",
            path,
            authId: key
          });
        }
      }

      if (type === API_KEY && !security.name) {
        errors.push({
          message:
            "apiKey authorization must have required 'name' string property. The name of the header or query parameter to be used.",
          path,
          authId: key
        });
      }
      // oauth2 validation
      else if (type === OAUTH2) {
        const flows = security.flows;
        const tokenUrl = security.tokenUrl;

        if (!flows) {
          errors.push({
            message:
              "oauth2 authorization must have required 'flows'. Valid values are 'implicit', 'password', 'clientCredentials' or 'authorizationCode'", /////recieved
            path,
            authId: key
          });
        } else if (
          !flows.implicit &&
          !flows.authorizationCode &&
          !flows.authorizationCode &&
          !flows.clientCredentials
        ) {
          errors.push({
            message:
              "oauth2 authorization must have required 'flows'. Valid values are 'implicit', 'password', 'clientCredentials' or 'authorizationCode'", /////recieved
            path,
            authId: key
          });
        } else if (flows && flows.implicit) {
          const authorizationUrl = flows.implicit.authorizationUrl;
          if (!authorizationUrl) {
            errors.push({
              message:
                "oauth2 authorization implicit flow must have required 'authorizationUrl' parameter if type is `implicit` or `authorizationCode`.", /////////exepected
              path,
              authId: key
            });
          } else if (
            type === OAUTH2 &&
            flows &&
            flows.implicit &&
            !flows.implicit.scopes
          ) {
            errors.push({
              message:
                "'scopes' is required property type object. The available scopes for the OAuth2 security scheme.",
              path,
              authId: key
            });
          }
        } else if (flows.authorizationCode) {
          const authorizationUrl = flows.authorizationUrl;
          if (!authorizationUrl) {
            errors.push({
              message:
                "oauth2 authorization implicit flow must have required 'authorizationUrl' parameter if type is `implicit` or `authorizationCode`.", /////////exepected
              path,
              authId: key
            });
          }
        } else if (
          flows === AUTHORIZATION_CODE ||
          flows === PASSWORD ||
          flows === CLIENT_CREDENTIALS
        ) {
          if (!tokenUrl) {
            errors.push({
              message:
                "oauth2 authorization authorizationCode flow must have required 'tokenUrl' string parameter if type is authorizationCode`, `password`, `clientCredentials`.",
              path,
              authId: key
            });
          }
        } else if (flows && flows.password) {
          const tokenURL = flows.tokenURL;
          if (!tokenURL) {
            errors.push({
              message:
                "oauth2 authorization password flow must have required 'tokenUrl' string parameter.",
              path,
              authId: key
            });
          }
        } else if (flows === CLIENT_CREDENTIALS) {
          if (!tokenUrl) {
            errors.push({
              message:
                "oauth2 authorization clientCredentials flow must have required 'tokenUrl' string parameter.",
              path,
              authId: key
            });
          }
        }
      } else if (type === HTTP) {
        //scheme is required
        if (!security.scheme) {
          errors.push({
            message:
              'scheme must be defined for type `http` and must be a string',
            path,
            authId: key
          });
        }
      } else if (type == OPENID_CONNECT) {
        const openIdConnectURL = security.openIdConnectUrl;
        if (
          !openIdConnectURL ||
          typeof openIdConnectURL != 'string' ||
          !validator.isurl(openIdConnectURL)
        ) {
          errors.push({
            message:
              'openIdConnectUrl must be defined for openIdConnect property and must be a valid URL',
            path,
            authId: key
          });
        }
      }
    }
  }
  return { errors, warnings };
};
