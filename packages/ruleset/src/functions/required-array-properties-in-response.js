/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isArraySchema,
  isObject,
  validateSubschemas,
} = require('@ibm-cloud/openapi-ruleset-utilities');
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
    checkForOptionalArrays,
    true,
    false
  );
};

/**
 * Checks "schema" for any optional array properties.
 * @param {*} schema the schema to check
 * @param {*} path the json path location of "schema"
 * @returns
 */
function checkForOptionalArrays(schema, path) {
  // If "schema" defines properties, then add an error for each optional array property.
  if (isObject(schema) && isObject(schema.properties)) {
    logger.debug(
      `${ruleId}: examining object schema at location: ${path.join('.')}`
    );

    // If "schema" is an allOf element, then we need to make an educated
    // guess as to whether or not we should complain about an optional array property.
    // This will be our heuristic:
    // If "schema" is an allOf element AND...
    // 1. DOES NOT INCLUDE the "required" field, then we'll assume that the allOf element
    //    IS NOT fully-defined and we'll avoid returning errors for any optional array properties
    //    within "schema".
    // 2. DOES INCLUDE the "required" field, then we'll assume that the allOf element is
    //    fully-defined and go ahead and return an error for any optional array properties.
    // This isn't perfect, but should allow us to make a good guess (famous last words, perhaps).
    if (path[path.length - 2] === 'allOf' && !('required' in schema)) {
      logger.debug(
        `${ruleId}: allOf element w/o 'required' field... skipping at location: ${path.join(
          '.'
        )}`
      );
      return [];
    }

    const errors = [];

    const requiredProps = schema.required || [];
    for (const [name, prop] of Object.entries(schema.properties)) {
      if (isArraySchema(prop) && !requiredProps.includes(name)) {
        errors.push({
          message: 'In a response body, an array field MUST NOT be optional',
          path: [...path, 'properties', name],
        });
      }
    }

    return errors;
  }

  return [];
}
