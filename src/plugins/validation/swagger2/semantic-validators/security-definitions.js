// Assertation 1: security definition must have type one of "apiKey" || "oauth2" || "basic"
// Assertation 2: "apiKey" security must have "in" one of "header" || "query", and required "name" string
// Assertation 3: "oauth2" security must have flow parameter one of "implicit" || "password" || "application" || "accessCode"
// Assertation 4: "oauth2" security flow "implicit" must have required string "authorizationUrl" and object "scopes" parameters
// Assertation 5: "oauth2" security flow "password" must have required string "tokenUrl" and object "scopes" parameters
// Assertation 5: "oauth2" security flow "accessCode" must have required string "tokenUrl", string "authorizationUrl" and object "scopes" parameters
// Assertation 6: "oauth2" security flow "application" must have required string "tokenUrl", string "authorizationUrl" and object "scopes" parameters

const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec }) {
  const messages = new MessageCarrier();

  const API_KEY = 'apiKey';
  const OAUTH2 = 'oauth2';
  const BASIC = 'basic';
  const auths = [API_KEY, OAUTH2, BASIC];
  const IMPLICIT = 'implicit';
  const PASSWORD = 'password';
  const APPLICATION = 'application';
  const ACCESS_CODE = 'accessCode';
  const oauth2Flows = [IMPLICIT, PASSWORD, APPLICATION, ACCESS_CODE];

  const securityDefinitions = jsSpec.securityDefinitions;

  for (const key in securityDefinitions) {
    const security = securityDefinitions[key];
    const type = security.type;
    const path = `securityDefinitions.${key}`;

    if (auths.indexOf(type) === -1) {
      messages.addMessageWithAuthId(
        path,
        `string 'type' param required for path: ${path}`,
        key,
        'error'
      );
    } else {
      //apiKey validation
      if (type === API_KEY) {
        const authIn = security.in;

        if (authIn !== 'query' && authIn !== 'header') {
          messages.addMessageWithAuthId(
            path,
            "apiKey authorization must have required 'in' param, valid values are 'query' or 'header'.",
            key,
            'error'
          );
        }

        if (!security.name) {
          messages.addMessageWithAuthId(
            path,
            "apiKey authorization must have required 'name' string param. The name of the header or query parameter to be used.",
            key,
            'error'
          );
        }
      } // oauth2 validation
      else if (type === OAUTH2) {
        const flow = security.flow;
        const authorizationUrl = security.authorizationUrl;
        const tokenUrl = security.tokenUrl;
        const scopes = security.scopes;

        if (oauth2Flows.indexOf(flow) === -1) {
          messages.addMessageWithAuthId(
            path,
            "oauth2 authorization must have required 'flow' string param. Valid values are 'implicit', 'password', 'application' or 'accessCode'",
            key,
            'error'
          );
        } else if (flow === IMPLICIT) {
          if (!authorizationUrl) {
            messages.addMessageWithAuthId(
              path,
              "oauth2 authorization implicit flow must have required 'authorizationUrl' parameter.",
              key,
              'error'
            );
          }
        } else if (flow === ACCESS_CODE) {
          if (!authorizationUrl || !tokenUrl) {
            messages.addMessageWithAuthId(
              path,
              "oauth2 authorization accessCode flow must have required 'authorizationUrl' and 'tokenUrl' string parameters.",
              key,
              'error'
            );
          }
        } else if (flow === PASSWORD) {
          if (!tokenUrl) {
            messages.addMessageWithAuthId(
              path,
              "oauth2 authorization password flow must have required 'tokenUrl' string parameter.",
              key,
              'error'
            );
          }
        } else if (flow === APPLICATION) {
          if (!tokenUrl) {
            messages.addMessageWithAuthId(
              path,
              "oauth2 authorization application flow must have required 'tokenUrl' string parameter.",
              key,
              'error'
            );
          }
        }

        if (typeof scopes !== 'object') {
          messages.addMessageWithAuthId(
            path,
            "'scopes' is required property type object. The available scopes for the OAuth2 security scheme.",
            key,
            'error'
          );
        }
      }
    }
  }

  return messages;
};
