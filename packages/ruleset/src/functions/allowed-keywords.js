/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { validateSubschemas } = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (obj, options, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return validateSubschemas(
    obj,
    context.path,
    (schema, path) => allowedKeywords(schema, path, options),
    true,
    true
  );
};

/**
 * This function will check to make sure that 'obj' is an object that contains only fields (keys)
 * that are contained in the configured allow-list or extensions ('x-*').
 * @param {*} obj the object within the OpenAPI document to check for allowed keywords
 * @param {*} path the location of 'obj' within the OpenAPI document
 * @param {*} options this is the value of the 'functionOptions' field within this rule's definition.
 * This should be an object with the following fields:
 *   - 'keywordAllowList': an array of strings which are the allowed keywords
 *
 * @returns an array containing zero or more error objects
 */
function allowedKeywords(obj, path, options) {
  logger.debug(
    `${ruleId}: checking for allowed keywords in object located at: ${path.join(
      '.'
    )}`
  );

  // Find the fields of 'obj' that are not an extension or an allowed keyword.
  const disallowedKeywords = Object.keys(obj).filter(
    k => !(k.startsWith('x-') || options.keywordAllowList.includes(k))
  );

  // Return an error for each disallowed keyword that we found.
  if (disallowedKeywords.length) {
    logger.debug(
      `${ruleId}: found these disallowed keywords: ${JSON.stringify(
        disallowedKeywords
      )}`
    );

    return disallowedKeywords.map(k => {
      return {
        message: `Found disallowed keyword: ${k}`,
        path: [...path, k],
      };
    });
  }

  logger.debug(`PASSED!`);
  return [];
}
