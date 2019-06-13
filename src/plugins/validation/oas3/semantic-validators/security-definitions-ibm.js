/**
 * Copyright 2019 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Assertation 1: `type` is a necessary property and has four possible values: `apiKey`, `HTTP`, `oauth2`, `openIdConnect`
// Assertation 2: name property is required for `apiKey` type
// Assertation 3: `in` property is required for `apiKey` type, valid values are: `query`, `header` or `cookie`
// Assertation 4: `scheme` property` is required for `http` type
// Assertation 5: `flows` object is required for `oauth2` type
// Assertation 6: `opedIdConnectUrl` property is required for `openIdConnect` and must be a valid url

const validator = require('validator');

module.exports.validate = function({ resolvedSpec }) {
  const API_KEY = 'apiKey';
  const OAUTH2 = 'oauth2';
  const HTTP = 'http';
  const OPENID_CONNECT = 'openIdConnect';
  const authTypes = [API_KEY, HTTP, OAUTH2, OPENID_CONNECT];
  const PASSWORD = 'password';
  const CLIENT_CREDENTIALS = 'client_Credentials';
  const AUTHORIZATION_CODE = 'authorizationCode';
  const errors = [];
  const warnings = [];
  const securitySchemes =
    resolvedSpec.components && resolvedSpec.components.securitySchemes;

  for (const key in securitySchemes) {
    const path = `securitySchemes.${key}`;
    const security = securitySchemes[key];
    const type = security.type;

    if (!type) {
      errors.push({
        message: 'security scheme is missing required field `type`',
        path
      });
    } else if (authTypes.indexOf(type) === -1) {
      errors.push({
        message:
          '`type` must have one of the following types: `apiKey`, `oauth2`, `http`, `openIdConnect`',
        path
      });
    } else {
      //apiKey validation
      if (type === API_KEY) {
        const authIn = security.in;
        if (!authIn || !['query', 'header', 'cookie'].includes(authIn)) {
          errors.push({
            message:
              "apiKey authorization must have required 'in' property, valid values are 'query' or 'header' or 'cookie'.",
            path
          });
        }
        if (!security.name) {
          errors.push({
            message:
              "apiKey authorization must have required 'name' string property. The name of the header or query parameter to be used.",
            path
          });
        }
      }
      // oauth2 validation
      else if (type === OAUTH2) {
        const flows = security.flows;
        const tokenUrl = security.tokenUrl;

        if (!flows) {
          errors.push({
            message:
              "oauth2 authorization must have required 'flows' parameter",
            path
          });
        } else if (
          flows === AUTHORIZATION_CODE ||
          flows === PASSWORD ||
          flows === CLIENT_CREDENTIALS
        ) {
          if (!tokenUrl) {
            errors.push({
              message:
                "oauth2 authorization authorizationCode flow must have required 'tokenUrl' string parameter if type is `authorizationCode`, `password`, `clientCredentials`.",
              path
            });
          }
        } else if (
          !flows.implicit &&
          !flows.authorizationCode &&
          !flows.password &&
          !flows.clientCredentials
        ) {
          errors.push({
            message:
              "oauth2 authorization `flows` must have one of the following paramaters: 'implicit', 'password', 'clientCredentials' or 'authorizationCode'",
            path
          });
        } else if (flows.implicit) {
          const authorizationUrl = flows.implicit.authorizationUrl;
          if (!authorizationUrl) {
            errors.push({
              message:
                "oauth2 authorization implicit flow must have required 'authorizationUrl' parameter if type is `implicit`.",
              path
            });
          } else if (!flows.implicit.scopes) {
            errors.push({
              message:
                "oauth2 authorization implicit flow must have required 'scopes' property.",
              path
            });
          }
        } else if (flows.authorizationCode) {
          const authorizationUrl = flows.authorizationUrl;
          if (!authorizationUrl) {
            errors.push({
              message:
                "oauth2 authorization implicit flow must have required 'authorizationUrl' parameter if type is `implicit` or `authorizationCode`.",
              path
            });
          }
        } else if (flows.password) {
          const tokenURL = flows.tokenURL;
          if (!tokenURL) {
            errors.push({
              message:
                "oauth2 authorization password flow must have required 'tokenUrl' string parameter.",
              path
            });
          }
        } else if (flows.clientCredentials) {
          if (!tokenUrl) {
            errors.push({
              message:
                "oauth2 authorization clientCredentials flow must have required 'tokenUrl' string parameter.",
              path
            });
          }
        }
      } else if (type === HTTP) {
        //scheme is required
        if (!security.scheme) {
          errors.push({
            message: 'scheme must be defined for type `http`',
            path
          });
        }
      } else if (type == OPENID_CONNECT) {
        const openIdConnectURL = security.openIdConnectUrl;
        if (
          !openIdConnectURL ||
          typeof openIdConnectURL !== 'string' ||
          !validator.isurl(openIdConnectURL)
        ) {
          errors.push({
            message:
              'openIdConnectUrl must be defined for openIdConnect property and must be a valid URL',
            path
          });
        }
      }
    }
  }
  return { errors, warnings };
};
