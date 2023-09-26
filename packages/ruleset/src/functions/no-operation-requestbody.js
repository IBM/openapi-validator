/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (operation, options, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return noOperationRequestBody(operation, context.path, options);
};

/**
 * This function will check to make sure that certain operations do not have a requestBody.
 * @param {*} operation the operation object to check
 * @param {*} path the location of 'operation' within the OpenAPI document
 * @param {*} options this is the value of the 'functionOptions' field
 * within this rule's definition (see src/rules/operation-requestbody.js).
 * This should be an object with the following fields:
 *   - 'httpMethods': an array of strings which are the http methods that should be checked
 * @returns an array containing zero or more error objects
 */
function noOperationRequestBody(operation, path, options) {
  logger.debug(`${ruleId}: checking operation located at: ${path.join('.')}`);

  // Grab the operation's http method from the end of the path.
  const method = path[path.length - 1].trim().toLowerCase();

  // Make sure this is a method that we want to check.
  const shouldCheck = options.httpMethods.find(element => {
    return method === element.trim().toLowerCase();
  });
  if (!shouldCheck) {
    logger.debug(`Skip check!`);
    return [];
  }

  // Return a warning if we're looking at a requestBody.
  if ('requestBody' in operation) {
    logger.debug(`Found a requestBody!`);
    return [
      {
        message: `${method.toUpperCase()} operations should not define a requestBody`,
        path: [...path, 'requestBody'],
      },
    ];
  }

  logger.debug(`PASSED!`);
  return [];
}
