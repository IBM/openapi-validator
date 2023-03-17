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

  return checkUnusedTags(rootDocument);
};

/**
 * This function implements the 'unused-tag' validation rule.
 * The specific checks that are performed are:
 *
 * 1. Each tag defined in the global "tags" field must be referenced by at least one operation.
 *
 * @param {object} rootDocument the entire API definition (assumed to be an OpenAPI 3 document)
 * @returns an array of error objects
 */
function checkUnusedTags(rootDocument) {
  // Compile a list of all the tags.
  const globalTags = rootDocument.tags || [];

  // If no tags defined, then bail out now.
  if (!globalTags.length) {
    logger.debug(`${ruleId}: no tags defined!`);
    return [];
  }

  // Set of tags used by at least one operation.
  const usedTags = new Set();

  // Visit each operation and add its tag(s) to "usedTags".
  if (rootDocument.paths) {
    for (const pathStr in rootDocument.paths) {
      const pathItem = rootDocument.paths[pathStr];
      // Within the pathItem, visit only those fields that hold operations.
      for (const methodName of operationMethods) {
        const operationObj = pathItem[methodName];
        if (operationObj && operationObj.tags) {
          logger.debug(
            `${ruleId}: operation '${operationObj.operationId}' references tags: ${operationObj.tags}`
          );
          for (const tag of operationObj.tags) {
            usedTags.add(tag);
          }
        }
      }
    }
  }

  const errors = [];

  // Finally, report on any unused tags.
  for (const i in globalTags) {
    if (!usedTags.has(globalTags[i].name)) {
      logger.debug(`${ruleId}: tag '${globalTags[i].name} is unused!`);
      errors.push({
        message: `A tag is defined but never used: ${globalTags[i].name}`,
        path: ['tags', i.toString()],
      });
    }
  }

  return errors;
}
