/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isIntegerSchema,
  validateNestedSchemas,
} = require('@ibm-cloud/openapi-ruleset-utilities');

const { getCompositeSchemaAttribute, LoggerFactory } = require('../utils');

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
    integerBoundaryErrors,
    true,
    false
  );
};

// These are the valid format values that can be used with integer schemas.
const intFormats = ['int32', 'int64'];

/**
 * This function performs various checks on an integer schema property to make sure it
 * contains the "minimum", "maximum" attributes.
 * @param {*} schema the schema to check
 * @param {*} path the array of path segments indicating the "location" of the pathItem within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function integerBoundaryErrors(schema, path) {
  logger.debug(
    `${ruleId}: checking attributes of schema at location: ${path.join('.')}`
  );

  if (isIntegerSchema(schema)) {
    logger.debug('schema is an integer schema');

    const format = getCompositeSchemaAttribute(schema, 'format');
    const minimum = getCompositeSchemaAttribute(schema, 'minimum');
    const maximum = getCompositeSchemaAttribute(schema, 'maximum');

    const errors = [];

    if (isDefined(format) && !intFormats.includes(format)) {
      errors.push({
        message: `Integer schemas should specify format as one of ${intFormats.join(
          '.'
        )}`,
        path,
      });
    }
    if (!isDefined(minimum)) {
      errors.push({
        message: `Integer schemas should define property 'minimum'`,
        path,
      });
    }
    if (!isDefined(maximum)) {
      errors.push({
        message: `Integer schemas should define property 'maximum'`,
        path,
      });
    }
    if (isDefined(minimum) && isDefined(maximum) && minimum > maximum) {
      errors.push({
        message: `'minimum' cannot be greater than 'maximum'`,
        path,
      });
    }

    return errors;
  }

  return [];
}

function isDefined(x) {
  return x !== null && x !== undefined;
}
