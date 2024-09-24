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
