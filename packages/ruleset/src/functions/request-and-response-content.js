/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isObject,
  getResolvedSpec,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const {
  LoggerFactory,
  pathHasMinimallyRepresentedResource,
} = require('../utils');

let ruleId;
let logger;

/**
 * The implementation for this rule makes assumptions that are dependent on the
 * presence of the following other rules:
 *
 * ibm-operation-responses - all operations define a response
 *
 */

module.exports = function requestAndResponseContent(
  operation,
  options,
  context
) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return checkForContent(operation, context.path, getResolvedSpec(context));
};

/**
 * This function checks to ensure an operation defines "content" on its
 * requestBody and responses, when appropriate.
 *
 * @param {*} operation - openapi operation object
 * @param {*} path - path to current openapi artifact, as a list
 * @param {*} apidef - resolved api spec
 * @returns an array containing the violations found or [] if no violations
 */
function checkForContent(operation, path, apidef) {
  const errors = [];

  // Check request body for every operation.
  if (
    isObject(operation.requestBody) &&
    !isObject(operation.requestBody.content)
  ) {
    errors.push({
      message: '', // Use rule-defined message.
      path: [...path, 'requestBody'],
    });
  }

  // Check response bodies for the following operations.
  if (
    ['get', 'post', 'put', 'patch', 'delete'].includes(path.at(-1)) &&
    isObject(operation.responses)
  ) {
    for (const [statusCode, response] of Object.entries(operation.responses)) {
      // Skip exempt status codes.
      if (['204', '202', '101', '304'].includes(statusCode)) {
        continue;
      }

      // A PUT operation for a minimally represented resource (i.e. GET returns a 204)
      // is allowed to define a 201 response with no content.
      if (
        path.at(-1) === 'put' &&
        statusCode === '201' &&
        pathHasMinimallyRepresentedResource(path.at(-2), apidef)
      ) {
        continue;
      }

      if (!isObject(response.content)) {
        errors.push({
          message: '',
          path: [...path, 'responses', statusCode],
        });
      }
    }
  }

  return errors;
}
