/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  validateSubschemas,
  isNumberSchema,
  isIntegerSchema,
  isFloatSchema,
  isDoubleSchema,
  isObjectSchema,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;
module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return validateSubschemas(schema, context.path, checkPropertyAttributes);
};

/**
 * This rule performs the following checks on each schema (and schema property)
 * found in the API definition:
 * 1) minimum/maximum should not be defined for a non-numeric (number, integer) schema
 * 2) minimum <= maximum
 * 3) minItems/maxItems should not be defined for a non-array schema
 * 4) minProperties/maxProperties should not be defined for a non-object schema
 * 5) minProperties <= maxProperties
 *
 * @param {*} schema the schema to check
 * @param {*} path the array of path segments indicating the "location" of the schema within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function checkPropertyAttributes(schema, path) {
  logger.debug(
    `${ruleId}: checking attributes of schema at location: ${path.join('.')}`
  );

  const errors = [];

  if (isNumericSchema(schema)) {
    logger.debug('schema is numeric');

    // 2) minimum <= maximum
    if (schema.minimum && schema.maximum && schema.minimum > schema.maximum) {
      errors.push({
        message: `'minimum' cannot be greater than 'maximum'`,
        path: [...path, 'minimum'],
      });
    }
  } else {
    // 1) minimum/maximum should not be defined for a non-numeric (number, integer) schema
    if (schema.minimum) {
      errors.push({
        message: `'minimum' should not be defined for non-numeric schemas`,
        path: [...path, 'minimum'],
      });
    }
    if (schema.maximum) {
      errors.push({
        message: `'maximum' should not be defined for non-numeric schemas`,
        path: [...path, 'maximum'],
      });
    }
  }

  if (isObjectSchema(schema)) {
    logger.debug('schema is an object schema');

    // 5) minProperties <= maxProperties
    if (
      schema.minProperties &&
      schema.maxProperties &&
      schema.minProperties > schema.maxProperties
    ) {
      errors.push({
        message: `'minProperties' cannot be greater than 'maxProperties'`,
        path: [...path, 'minProperties'],
      });
    }
  } else {
    // 4) minProperties/maxProperties should not be defined for a non-object schema
    if (schema.minProperties) {
      errors.push({
        message: `'minProperties' should not be defined for non-object schemas`,
        path: [...path, 'minProperties'],
      });
    }
    if (schema.maxProperties) {
      errors.push({
        message: `'maxProperties' should not be defined for non-object schemas`,
        path: [...path, 'maxProperties'],
      });
    }
  }

  return errors;
}

function isNumericSchema(s) {
  return (
    isNumberSchema(s) ||
    isIntegerSchema(s) ||
    isFloatSchema(s) ||
    isDoubleSchema(s)
  );
}
