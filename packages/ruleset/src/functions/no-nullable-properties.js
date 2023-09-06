/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemaHasConstraint,
  validateSubschemas,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const {
  isMergePatchMimeType,
  LoggerFactory,
  operationMethods,
} = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _options, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return validateSubschemas(schema, context.path, noNullableProperties);
};

/**
 * This function will check to make sure that nullable properties exist only
 * within a JSON merge-patch operation's requestBody schema, per API Handbook guidance.
 * @param {*} schema the schema to check
 * @param {*} path the location of 'schema' within the OpenAPI document
 * @returns an array containing zero or more error objects
 */
function noNullableProperties(schema, path) {
  logger.debug(`${ruleId}: checking schema located at: ${path.join('.')}`);

  // Bail out immediately if 'schema' is within a JSON merge-patch requestBody,
  // as this is the only location where a nullable property is allowed.
  if (isInMergePatchBody(path)) {
    logger.debug(`${ruleId}: inside JSON merge-patch requestBody!`);
    return [];
  }

  logger.debug(`${ruleId}: looking at: ${JSON.stringify(schema, null, 2)}`);

  // Check if nullable is set on 'schema'.
  // Per the OpenAPI Specification (https://spec.openapis.org/oas/v3.0.3#schemaNullable),
  // the 'nullable' field is only applicable if the same schema object also explicitly contains
  // the 'type' field as well.
  if (schemaHasConstraint(schema, isNullable)) {
    logger.debug(`${ruleId}: found a nullable property: ${path.join('.')}`);
    return [
      {
        message:
          'nullable properties should be defined only within a JSON merge-patch request body schema',
        path,
      },
    ];
  }

  logger.debug(`PASSED!`);
  return [];
}

/**
 * Returns true iff schema 's' is declared to be 'nullable'.
 * In this context, a schema is nullable if one of the following is true:
 * 1. (openapi <= 3.0) the schema's 'type' field is explicitly defined (a string value)
 *    AND the schema's 'nullable' field is explicitly set to true.
 * 2. (openapi >= 3.1) the schema's 'type' field is an array and contains 'null' as a value
 * @param {*} s the schema to check
 * @returns true if 's' is defined as nullable, false otherwise
 */
function isNullable(s) {
  return (
    (Array.isArray(s.type) && s.type.includes('null')) ||
    (typeof s.type === 'string' && s.type && s.nullable === true)
  );
}

/**
 * Checks to see if 'path' is the location of a schema property within a
 * JSON merge-patch operation's requestBody schema.
 * @param {*} path the jsonpath location to check
 * @returns true if 'path' specifies a location within a JSON merge-patch requestBody schema, false otherwise.
 *
 */
function isInMergePatchBody(path) {
  return (
    Array.isArray(path) &&
    path.length >= 7 &&
    path[0] === 'paths' &&
    operationMethods.includes(path[2]) &&
    path[3] === 'requestBody' &&
    isMergePatchMimeType(path[5]) &&
    path[6] === 'schema'
  );
}
