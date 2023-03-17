/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { LoggerFactory, operationMethods } = require('../utils');

let ruleId;
let logger;

module.exports = function (rootDocument, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return checkSecuritySchemes(rootDocument);
};

// Security scheme types that support scopes.
const schemeTypesSupportScopes = ['oauth2', 'openIdConnect'];

// Security scheme types that define scopes.
const schemeTypesDefineScopes = ['oauth2'];

/**
 * This function implements the 'securityschemes' validation rule.
 * The specific checks that are performed are:
 *
 * 1. The name used within a security requirement object must correspond to a
 * security scheme that is properly defined in "components.securitySchemes".
 * Reference: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#patterned-fields-3
 *
 * 2. Each security scheme defined in "components.securitySchemes" should be referenced
 * by at least one security requirement object.
 *
 * 3. Each scope referenced within a security requirement object for an oauth2-type security scheme
 * must be defined within that security scheme.
 *
 * 4. Each scope that is defined within an oath2-type security scheme should be
 * referenced by at least one security requirement object.
 *
 * 5. If a security requirement object is associated with a security scheme that does not support
 * scopes, then its scopes array MUST be empty.
 *
 * @param {object} rootDocument the entire API definition (assumed to be an OpenAPI 3 document)
 * @returns an array of error objects
 */
function checkSecuritySchemes(rootDocument) {
  logger.debug(
    `${ruleId}: checking securityScheme usage throughout API definition.`
  );

  // Grab the securitySchemes from the API definition.
  const securitySchemes =
    rootDocument.components && rootDocument.components.securitySchemes;

  // If we have any security schemes, build an object to store usage info.
  const usageInfo = {};
  if (securitySchemes) {
    for (const schemeName in securitySchemes) {
      if (schemeName.slice(0, 2) === 'x-') continue;

      const scheme = securitySchemes[schemeName];

      // Build an entry for this scheme's usage info.
      const usageEntry = {
        used: false,
        type: scheme.type,
        scopeUsage: {},
      };

      // If applicable, set up the "scopeUsage" object for any scopes that are defined.
      if (schemeTypesDefineScopes.includes(scheme.type) && scheme.flows) {
        // Reference: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#oauth-flows-object
        for (const flowType in scheme.flows) {
          const flow = scheme.flows[flowType];
          if (flow.scopes) {
            for (const scope in flow.scopes) {
              // Scopes can be shared across the different flow objects within a security scheme,
              // so we'll build a scope usage entry only the first time we encounter
              // a particular scope within this security scheme.
              if (!usageEntry.scopeUsage[scope]) {
                usageEntry.scopeUsage[scope] = {
                  used: false,
                  flow: flowType,
                };
              }
            }
          }
        }
      }

      usageInfo[schemeName] = usageEntry;
    }
    logger.debug(
      `${ruleId}: found these securitySchemes in the API definition: ${Object.keys(
        usageInfo
      ).join(', ')}`
    );
  } else {
    logger.debug(`${ruleId}:  No securitySchemes found in the API definition!`);
  }

  // Next, visit each "security" object and record its usage.
  // Security objects can exist in the "security" field at the root of the document,
  // or within the "security" field of an operation.
  const errors = [];

  // 1. Record usage info for the global "security" field.
  if (rootDocument.security) {
    logger.debug(`${ruleId}: checking global security object`);
    errors.push(...recordUsage(rootDocument.security, usageInfo, ['security']));
  }

  // 2. Visit each operation and record usage info for its "security" field.
  if (rootDocument.paths) {
    for (const pathStr in rootDocument.paths) {
      const pathItem = rootDocument.paths[pathStr];
      // Within the pathItem, visit only those fields that hold operations.
      for (const methodName of operationMethods) {
        const operationObj = pathItem[methodName];
        if (operationObj && operationObj.security) {
          logger.debug(
            `${ruleId}: checking operation '${operationObj.operationId}'`
          );
          errors.push(
            ...recordUsage(operationObj.security, usageInfo, [
              'paths',
              pathStr,
              methodName,
              'security',
            ])
          );
        }
      }
    }
  }

  // Finally, report warnings for any unreferenced security schemes or scopes.
  for (const schemeName in usageInfo) {
    const usageEntry = usageInfo[schemeName];
    if (usageEntry.used === false) {
      logger.debug(
        `${ruleId}: securityScheme '${schemeName}' defined but not used!`
      );
      errors.push({
        message: 'A security scheme is defined but never used',
        path: ['components', 'securitySchemes', schemeName],
      });
    }

    for (const scope in usageEntry.scopeUsage) {
      const scopeUsageEntry = usageEntry.scopeUsage[scope];
      if (scopeUsageEntry.used === false) {
        logger.debug(`${ruleId}: scope '${scope}' defined but not used!`);
        errors.push({
          message: 'A security scope is defined but never used',
          path: [
            'components',
            'securitySchemes',
            schemeName,
            'flows',
            scopeUsageEntry.flow,
            'scopes',
            scope,
          ],
        });
      }
    }
  }

  return errors;
}

/**
 * Record usage information for each "security requirement" object contained in "securityList".
 * Each security requirement object contains a field (key) whose name matches the name of
 * a securityScheme defined in components.securitySchemes.
 * (reference: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#securityRequirementObject).
 *
 * @param {*} securityList a list of "security requirement" objects
 * @param {*} usageInfo an object containing scheme and scope usage info
 * @param {*} path a list of strings representing the json path to "securityList"
 * @return a list of zero or more errors
 */
function recordUsage(securityList, usageInfo, path) {
  if (!Array.isArray(securityList)) return [];

  const errors = [];

  for (const securityIndex in securityList) {
    const securityObj = securityList[securityIndex];
    for (const schemeName in securityObj) {
      const usageEntry = usageInfo[schemeName];
      if (usageEntry) {
        // Record the usage of the scheme.
        usageEntry.used = true;

        if (schemeTypesSupportScopes.includes(usageEntry.type)) {
          // For security schemes that support scopes, record the usage of the scopes.
          for (const scopeIndex in securityObj[schemeName]) {
            const scope = securityObj[schemeName][scopeIndex];
            const scopeUsageEntry = usageEntry.scopeUsage[scope];
            if (scopeUsageEntry) {
              scopeUsageEntry.used = true;
            } else {
              if (schemeTypesDefineScopes.includes(usageEntry.type)) {
                // Only return an error for an "undefined scope" if
                // the scheme type is one where scopes are defined locally (e.g. 'oauth2').
                logger.debug(
                  `${ruleId}: undefined security scope referenced: ${scope}`
                );
                errors.push({
                  message: 'An undefined security scope is referenced',
                  path: [
                    ...path,
                    securityIndex.toString(),
                    schemeName,
                    scopeIndex,
                  ],
                });
              }
            }
          }
        } else {
          // For a scheme that doesn't support scopes, verify that the scopes array is empty.
          const scopes = securityObj[schemeName];
          if (scopes && scopes.length) {
            logger.debug(`${ruleId}: unexpected scopes found!`);
            errors.push({
              message:
                'For security scheme types that do not support scopes, the value must be an empty array',
              path: [...path, securityIndex.toString(), schemeName],
            });
          }
        }
      } else {
        logger.debug(
          `${ruleId}: undefined securitySchema referenced: ${schemeName}`
        );
        errors.push({
          message: 'An undefined security scheme is referenced',
          path: [...path, securityIndex.toString(), schemeName],
        });
      }
    }
  }

  return errors;
}
