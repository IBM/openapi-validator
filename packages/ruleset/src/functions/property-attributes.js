/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  validateSubschemas,
  isBooleanSchema,
  isNumberSchema,
  isIntegerSchema,
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
 * 1) Number-scope keywords should not be defined for a non-numeric (number, integer) schema
 * 2) minimum <= maximum
 * 4) Object-scope keywords should not be defined for a non-object schema
 * 5) minProperties <= maxProperties
 * 6) enum field should not be present for object or boolean schemas
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
    // Avoid checking integer schema properties in favor of the ibm-integer-attributes rule.
    if (!isIntegerSchema(schema)) {
      logger.debug('schema is numeric');

      // 2) minimum <= maximum
      if (
        'minimum' in schema &&
        'maximum' in schema &&
        schema.minimum > schema.maximum
      ) {
        errors.push({
          message: `'minimum' cannot be greater than 'maximum'`,
          path: [...path, 'minimum'],
        });
      }
    }
  } else {
    // 1) minimum/maximum/multipleOf/exclusiveMaximum/exclusiveMinimum
    //    should not be defined for a non-numeric (number, integer) schema
    if ('minimum' in schema) {
      errors.push({
        message: `'minimum' should not be defined for non-numeric schemas`,
        path: [...path, 'minimum'],
      });
    }
    if ('maximum' in schema) {
      errors.push({
        message: `'maximum' should not be defined for non-numeric schemas`,
        path: [...path, 'maximum'],
      });
    }
    if ('multipleOf' in schema) {
      errors.push({
        message: `'multipleOf' should not be defined for non-numeric schemas`,
        path: [...path, 'multipleOf'],
      });
    }
    if ('exclusiveMaximum' in schema) {
      errors.push({
        message: `'exclusiveMaximum' should not be defined for non-numeric schemas`,
        path: [...path, 'exclusiveMaximum'],
      });
    }
    if ('exclusiveMinimum' in schema) {
      errors.push({
        message: `'exclusiveMinimum' should not be defined for non-numeric schemas`,
        path: [...path, 'exclusiveMinimum'],
      });
    }
  }

  if (isObjectSchema(schema)) {
    logger.debug('schema is an object schema');

    // 5) minProperties <= maxProperties
    if (
      'minProperties' in schema &&
      'maxProperties' in schema &&
      schema.minProperties > schema.maxProperties
    ) {
      errors.push({
        message: `'minProperties' cannot be greater than 'maxProperties'`,
        path: [...path, 'minProperties'],
      });
    }

    // 6) enum should not be present
    if ('enum' in schema) {
      errors.push({
        message: `'enum' should not be defined for object schemas`,
        path: [...path, 'enum'],
      });
    }
  } else {
    // 4) minProperties/maxProperties/additionalProperties/properties/required
    //    should not be defined for a non-object schema
    if ('minProperties' in schema) {
      errors.push({
        message: `'minProperties' should not be defined for non-object schemas`,
        path: [...path, 'minProperties'],
      });
    }
    if ('maxProperties' in schema) {
      errors.push({
        message: `'maxProperties' should not be defined for non-object schemas`,
        path: [...path, 'maxProperties'],
      });
    }
    if ('additionalProperties' in schema) {
      errors.push({
        message: `'additionalProperties' should not be defined for non-object schemas`,
        path: [...path, 'additionalProperties'],
      });
    }
    if ('properties' in schema) {
      errors.push({
        message: `'properties' should not be defined for non-object schemas`,
        path: [...path, 'properties'],
      });
    }
    if ('required' in schema) {
      errors.push({
        message: `'required' should not be defined for non-object schemas`,
        path: [...path, 'required'],
      });
    }
  }

  if (isBooleanSchema(schema)) {
    // 6) enum should not be present
    if ('enum' in schema) {
      errors.push({
        message: `'enum' should not be defined for boolean schemas`,
        path: [...path, 'enum'],
      });
    }
  }

  return errors;
}

function isNumericSchema(s) {
  return isNumberSchema(s) || isIntegerSchema(s);
}
