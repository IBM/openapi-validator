"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.validate = validate;
// Assertation 1: security definition must have type one of "apiKey" || "oauth2" || "basic"
// Assertation 2: "apiKey" security must have "in" one of "header" || "query", and required "name" string
// Assertation 3: "oauth2" security must have flow parameter one of "implicit" || "password" || "application" || "accessCode"
// Assertation 4: "oauth2" security flow "implicit" must have required string "authorizationUrl" and object "scopes" parameters
// Assertation 5: "oauth2" security flow "password" must have required string "tokenUrl" and object "scopes" parameters
// Assertation 5: "oauth2" security flow "accessCode" must have required string "tokenUrl", string "authorizationUrl" and object "scopes" parameters
// Assertation 6: "oauth2" security flow "application" must have required string "tokenUrl", string "authorizationUrl" and object "scopes" parameters


function validate(_ref) {
  var jsSpec = _ref.jsSpec;

  var API_KEY = "apiKey";
  var OAUTH2 = "oauth2";
  var BASIC = "basic";
  var auths = [API_KEY, OAUTH2, BASIC];
  var IMPLICIT = "implicit";
  var PASSWORD = "password";
  var APPLICATION = "application";
  var ACCESS_CODE = "accessCode";
  var oauth2Flows = [IMPLICIT, PASSWORD, APPLICATION, ACCESS_CODE];

  var errors = [];
  var warnings = [];

  var securityDefinitions = jsSpec.securityDefinitions;

  for (var key in securityDefinitions) {
    var security = securityDefinitions[key];
    var type = security.type;
    var path = "securityDefinitions." + key;

    if (auths.indexOf(type) === -1) {
      errors.push({
        message: path + " must have required string 'type' param",
        path: path,
        authId: key
      });
    } else {
      //apiKey validation
      if (type === API_KEY) {
        var authIn = security.in;

        if (authIn !== "query" && authIn !== "header") {
          errors.push({
            message: "apiKey authorization must have required 'in' param, valid values are 'query' or 'header'.",
            path: path,
            authId: key
          });
        }

        if (!security.name) {
          errors.push({
            message: "apiKey authorization must have required 'name' string param. The name of the header or query parameter to be used.",
            path: path,
            authId: key
          });
        }
      } // oauth2 validation
      else if (type === OAUTH2) {
          var flow = security.flow;
          var authorizationUrl = security.authorizationUrl;
          var tokenUrl = security.tokenUrl;
          var scopes = security.scopes;

          if (oauth2Flows.indexOf(flow) === -1) {
            errors.push({
              message: "oauth2 authorization must have required 'flow' string param. Valid values are 'implicit', 'password', 'application' or 'accessCode'",
              path: path,
              authId: key
            });
          } else if (flow === IMPLICIT) {
            if (!authorizationUrl) {
              errors.push({
                message: "oauth2 authorization implicit flow must have required 'authorizationUrl' parameter.",
                path: path,
                authId: key
              });
            }
          } else if (flow === ACCESS_CODE) {
            if (!authorizationUrl || !tokenUrl) {
              errors.push({
                message: "oauth2 authorization accessCode flow must have required 'authorizationUrl' and 'tokenUrl' string parameters.",
                path: path,
                authId: key
              });
            }
          } else if (flow === PASSWORD) {
            if (!tokenUrl) {
              errors.push({
                message: "oauth2 authorization password flow must have required 'tokenUrl' string parameter.",
                path: path,
                authId: key
              });
            }
          } else if (flow === APPLICATION) {
            if (!tokenUrl) {
              errors.push({
                message: "oauth2 authorization application flow must have required 'tokenUrl' string parameter.",
                path: path,
                authId: key
              });
            }
          }

          if ((typeof scopes === "undefined" ? "undefined" : _typeof(scopes)) !== "object") {
            errors.push({
              message: "'scopes' is required property type object. The available scopes for the OAuth2 security scheme.",
              path: path,
              authId: key
            });
          }
        }
    }
  }

  return { errors: errors, warnings: warnings };
}