/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isArraySchema } = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;
module.exports = function (operation, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return checkForArrayResponses(operation, context.path);
};

/**
 * Checks for operations that are defined as returning a top-level array in
 * a response. This is considered a bad practice.  Instead, the response body
 * should be defined as an object with a property that contains the array.
 * This provides flexibility to expand the response body definition in the future.
 * @param {*} op the operation to check
 * @param {*} path the array of path segments indicating the "location" of the pathItem within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function checkForArrayResponses(op, path) {
  logger.debug(`${ruleId}: checking operation at location: ${path.join('.')}`);

  const errors = [];

  // Check for an array schema within each response.
  for (const [responseCode, response] of Object.entries(op.responses || {})) {
    logger.debug(`${ruleId}: checking responses for code '${responseCode}'`);
    for (const [mimeType, contentEntry] of Object.entries(
      response.content || {}
    )) {
      logger.debug(`${ruleId}: checking response for mimetype '${mimeType}'`);
      if (contentEntry.schema && isArraySchema(contentEntry.schema)) {
        logger.debug('Found an array response!');
        errors.push({
          message:
            'Operations should not return an array as the top-level structure of a response',
          path: [
            ...path,
            'responses',
            responseCode,
            'content',
            mimeType,
            'schema',
          ],
        });
      }
    }
  }

  return errors;
}
