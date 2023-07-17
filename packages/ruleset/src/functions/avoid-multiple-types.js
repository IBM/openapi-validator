/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  validateNestedSchemas,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return validateNestedSchemas(
    schema,
    context.path,
    avoidMultipleTypes,
    true,
    false
  );
};

/**
 * Warns about the presence of multiple types within a schema's "type" field.
 * @param {*} schema the schema to check
 * @param {*} path the array of path segments indicating the location of "schema" within the API definition
 * @returns an array of zero or more errors
 */
function avoidMultipleTypes(schema, path) {
  logger.debug(
    `${ruleId}: checking 'type' in schema at location: ${path.join('.')}`
  );

  if (!schema.type || typeof schema.type === 'string') {
    return [];
  }

  const errors = [];

  if (Array.isArray(schema.type)) {
    const filteredTypes = schema.type.filter(t => t !== 'null');

    if (filteredTypes.length > 1) {
      logger.debug(
        `${ruleId}: detected multiple types at location: ${path.join('.')}.type`
      );
      errors.push({
        message: `Avoid multiple types in schema 'type' field`,
        path: [...path, 'type'],
      });
    }
  }

  return errors;
}
