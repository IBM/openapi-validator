// From swagger-tools -
// Assertation 1: Security requirements defined in securityDefinitions should be used in the spec
// Assertation 2: Each scope defined in an OAuth2 scheme should be used in the spec

const each = require('lodash/each');
const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ resolvedSpec, isOAS3 }, config) {
  const messages = new MessageCarrier();

  config = config.security_definitions;

  const definedSchemes = {};
  const definedScopes = {};

  // collect the security requirements and all relevant scopes

  const securityDefinitions = isOAS3
    ? resolvedSpec.components && resolvedSpec.components.securitySchemes
    : resolvedSpec.securityDefinitions;

  each(securityDefinitions, (scheme, name) => {
    if (name.slice(0, 2) === 'x-') return;

    definedSchemes[name] = {};
    definedSchemes[name].used = false;
    definedSchemes[name].type = scheme.type;

    // collect scopes in oauth2 schemes
    if (scheme.type.toLowerCase() === 'oauth2') {
      if (isOAS3) {
        if (scheme.flows) {
          each(scheme.flows, (flow, flowType) => {
            if (flow.scopes) {
              Object.keys(flow.scopes).forEach(scope => {
                definedScopes[scope] = {};
                definedScopes[scope].used = false;
                definedScopes[scope].scheme = name;
                definedScopes[scope].flow = flowType;
              });
            }
          });
        }
      } else if (scheme.scopes) {
        Object.keys(scheme.scopes).forEach(scope => {
          definedScopes[scope] = {};
          definedScopes[scope].used = false;
          definedScopes[scope].scheme = name;
        });
      }
    }
  });

  // check all instances of 'security' objects
  // security objects can exist at either:

  // 1) the top level of the spec (global definition)
  if (resolvedSpec.security) {
    flagUsedDefinitions(resolvedSpec.security);
  }

  // 2) within operations objects
  const paths = resolvedSpec.paths;
  each(paths, (operations, pathName) => {
    if (pathName.slice(0, 2) === 'x-') return;
    each(operations, (operation, opName) => {
      if (opName.slice(0, 2) === 'x-') return;
      if (operation.security) {
        flagUsedDefinitions(operation.security);
      }
    });
  });

  function flagUsedDefinitions(security) {
    security.forEach(scheme => {
      const schemeNames = Object.keys(scheme);

      schemeNames.forEach(schemeName => {
        // make sure this scheme was in the security definitions, then label as used
        if (definedSchemes[schemeName]) {
          definedSchemes[schemeName].used = true;

          const type = definedSchemes[schemeName].type;
          const scopesArray = scheme[schemeName];

          if (type.toLowerCase() === 'oauth2') {
            scopesArray.forEach(scope => {
              if (definedScopes[scope]) {
                definedScopes[scope].used = true;
              }
            });
          }
        }
      });
    });
  }

  // check what has been used and what has not been
  each(definedSchemes, (info, name) => {
    if (info.used === false) {
      const location = isOAS3
        ? 'components.securitySchemes'
        : 'securityDefinitions';
      messages.addMessage(
        `${location}.${name}`,
        `A security scheme is defined but never used: ${name}`,
        config.unused_security_schemes,
        'unused_security_schemes'
      );
    }
  });

  each(definedScopes, (info, name) => {
    if (info.used === false) {
      const path = isOAS3
        ? `components.securitySchemes.${info.scheme}.flows.${
            info.flow
          }.scopes.${name}`
        : `securityDefinitions.${info.scheme}.scopes.${name}`;
      messages.addMessage(
        path,
        `A security scope is defined but never used: ${name}`,
        config.unused_security_scopes,
        'unused_security_scopes'
      );
    }
  });

  return messages;
};
