/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemaHasConstraint,
  isStringSchema,
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
    stringBoundaryErrors,
    true,
    false
  );
};

// An object holding a list of "format" values to be bypassed when checking
// for the "pattern", "minLength" and "maxLength" fields of a string property, respectively.
const bypassFormats = {
  pattern: ['binary', 'byte', 'date', 'date-time', 'url'],
  minLength: ['date', 'identifier', 'url'],
  maxLength: ['date'],
};

/**
 * This function performs various checks on a string schema property to make sure it
 * contains the "pattern", "minLength" and "maxLength" attributes.
 * @param {*} schema the schema to check
 * @param {*} path the array of path segments indicating the "location" of the pathItem within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function stringBoundaryErrors(schema, path) {
  logger.debug(
    `${ruleId}: checking attributes of schema at location: ${path.join('.')}`
  );

  const errors = [];

  // Only check for the presence of validation keywords on input schemas
  // (i.e. those used for parameters and request bodies).
  if (isStringSchema(schema)) {
    logger.debug('schema is a string schema');

    // Perform these checks only if enum is not defined.
    if (!schemaContainsAttribute(schema, 'enum')) {
      // Retrieve the relevant attributes of "schema" ahead of time for use below.
      const format = getCompositeSchemaAttribute(schema, 'format');
      const pattern = getCompositeSchemaAttribute(schema, 'pattern');
      const minLength = getCompositeSchemaAttribute(schema, 'minLength');
      const maxLength = getCompositeSchemaAttribute(schema, 'maxLength');

      if (!isDefined(pattern) && !bypassFormats.pattern.includes(format)) {
        errors.push({
          message: `String schemas should define property 'pattern'`,
          path,
        });
      }
      if (!isDefined(minLength) && !bypassFormats.minLength.includes(format)) {
        errors.push({
          message: `String schemas should define property 'minLength'`,
          path,
        });
      }
      if (!isDefined(maxLength) && !bypassFormats.maxLength.includes(format)) {
        errors.push({
          message: `String schemas should define property 'maxLength'`,
          path,
        });
      }
      if (
        isDefined(minLength) &&
        isDefined(maxLength) &&
        minLength > maxLength
      ) {
        errors.push({
          message: `'minLength' cannot be greater than 'maxLength'`,
          path,
        });
      }
    }
  } else {
    // Make sure that string-related fields are not present in a non-string schema.
    if (schemaContainsAttribute(schema, 'pattern')) {
      errors.push({
        message: `'pattern' should not be defined for non-string schemas`,
        path: [...path, 'pattern'],
      });
    }
    if (schemaContainsAttribute(schema, 'minLength')) {
      errors.push({
        message: `'minLength' should not be defined for non-string schemas`,
        path: [...path, 'minLength'],
      });
    }
    if (schemaContainsAttribute(schema, 'maxLength')) {
      errors.push({
        message: `'maxLength' should not be defined for non-string schemas`,
        path: [...path, 'maxLength'],
      });
    }
  }

  return errors;
}

function isDefined(x) {
  return x !== null && x !== undefined;
}

// Returns true iff 'schema' contains the specified attribute either
// directly or within one of its composition "children".
function schemaContainsAttribute(schema, attrName) {
  return schemaHasConstraint(
    schema,
    s => attrName in s && isDefined(s[attrName])
  );
}
