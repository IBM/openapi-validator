const {
  schemaHasConstraint,
  isStringSchema,
  validateNestedSchemas
} = require('@ibm-cloud/openapi-ruleset-utilities');

const { getCompositeSchemaAttribute } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateNestedSchemas(schema, path, stringBoundaryErrors, true, false);
};

// Rudimentary debug logging that is useful in debugging this rule.
const debugEnabled = false;
function debug(msg) {
  if (debugEnabled) {
    console.log(msg);
  }
}

// An object holding a list of "format" values to be bypassed when checking
// for the "pattern", "minLength" and "maxLength" fields of a string property, respectively.
const bypassFormats = {
  pattern: ['binary', 'byte', 'date', 'date-time', 'url'],
  minLength: ['date', 'identifier', 'url'],
  maxLength: ['date']
};

/**
 * This function performs various checks on a string schema property to make sure it
 * contains the "pattern", "minLength" and "maxLength" attributes.
 * @param {*} schema the schema to check
 * @param {*} path the array of path segments indicating the "location" of the pathItem within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function stringBoundaryErrors(schema, path) {
  const errors = [];

  if (isStringSchema(schema)) {
    // Perform these checks only if enum is not defined.
    if (!schemaContainsAttribute(schema, 'enum')) {
      // Retrieve the relevant attributes of "schema" ahead of time for use below.
      const format = getCompositeSchemaAttribute(schema, 'format');
      const pattern = getCompositeSchemaAttribute(schema, 'pattern');
      const minLength = getCompositeSchemaAttribute(schema, 'minLength');
      const maxLength = getCompositeSchemaAttribute(schema, 'maxLength');

      if (!isDefined(pattern) && !bypassFormats.pattern.includes(format)) {
        errors.push({
          message: 'Should define a pattern for a valid string',
          path
        });
        debug('>>> pattern field missing for: ' + path.join('.'));
      }
      if (!isDefined(minLength) && !bypassFormats.minLength.includes(format)) {
        errors.push({
          message: 'Should define a minLength for a valid string',
          path
        });
        debug('>>> minLength field missing for: ' + path.join('.'));
      }
      if (!isDefined(maxLength) && !bypassFormats.maxLength.includes(format)) {
        errors.push({
          message: 'Should define a maxLength for a valid string',
          path
        });
        debug('>>> maxLength field missing for: ' + path.join('.'));
      }
      if (
        isDefined(minLength) &&
        isDefined(maxLength) &&
        minLength > maxLength
      ) {
        errors.push({
          message: 'minLength cannot be greater than maxLength',
          path
        });
        debug('>>> minLength > maxLength for: ' + path.join('.'));
      }
    }
  } else {
    // Make sure that string-related fields are not present in a non-string schema.
    if (schemaContainsAttribute(schema, 'pattern')) {
      errors.push({
        message: 'pattern should not be defined for a non-string schema',
        path: [...path, 'pattern']
      });
    }
    if (schemaContainsAttribute(schema, 'minLength')) {
      errors.push({
        message: 'minLength should not be defined for a non-string schema',
        path: [...path, 'minLength']
      });
    }
    if (schemaContainsAttribute(schema, 'maxLength')) {
      errors.push({
        message: 'maxLength should not be defined for a non-string schema',
        path: [...path, 'maxLength']
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
