/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isObject } = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (exampleObj, options, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return noRefInExample(exampleObj, context.path);
};

/**
 * This function will perform a recursive check to make sure that the specified
 * "example" value does not contain a "$ref" field.
 * @param {*} example the example value to check
 * @param {*} path the location of 'example' within the OpenAPI document
 * @returns an array containing zero or more error objects
 */
function noRefInExample(example, path) {
  logger.debug(`${ruleId}: checking example located at: ${path.join('.')}`);

  // If it's not an object, then bail out now since a $ref property is not possible.
  if (!isObject(example)) {
    return [];
  }

  const errors = [];

  // Check "example" for a $ref property.
  if ('$ref' in example) {
    logger.debug(
      `${ruleId}: found a $ref property at location: ${path.join('.')}.$ref`
    );
    errors.push({
      message: '',
      path: [...path, '$ref'],
    });
  }

  // Check each property of "example" recursively for an object containing a $ref property.
  for (const p in example) {
    errors.push(...noRefInExample(example[p], [...path, p]));
  }

  return errors;
}
