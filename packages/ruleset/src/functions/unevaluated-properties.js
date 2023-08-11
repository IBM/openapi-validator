/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { validateSubschemas } = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return validateSubschemas(
    schema,
    context.path,
    unevaluatedProperties,
    true,
    false
  );
};

/**
 * If 'unevaluatedProperties' is specified within "schema" then it must be set to false.
 *
 * @param {*} schema the schema to check
 * @param {*} path the array of path segments indicating the location of "schema" within the API definition
 * @returns an array of zero or more errors
 */
function unevaluatedProperties(schema, path) {
  logger.debug(
    `${ruleId}: checking 'unevaluatedProperties' in schema at location: ${path.join(
      '.'
    )}`
  );

  // If "unevaluatedProperties" is specified and it is NOT false, we have an error.
  if (
    'unevaluatedProperties' in schema &&
    schema.unevaluatedProperties !== false
  ) {
    logger.debug(`${ruleId}: Error: unevaluatedProperties !== false!`);
    return [
      {
        message: 'unevaluatedProperties must be set to false, if present',
        path: [...path, 'unevaluatedProperties'],
      },
    ];
  }

  logger.debug(`${ruleId}: PASSED!`);
  return [];
}
