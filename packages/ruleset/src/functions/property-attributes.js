const {
  validateSubschemas,
  isNumberSchema,
  isIntegerSchema,
  isFloatSchema,
  isDoubleSchema,
  isArraySchema,
  isObjectSchema
} = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, checkPropertyAttributes);
};

/**
 * This rule performs the following checks on each schema (and schema property)
 * found in the API definition:
 * 1) minimum/maximum should not be defined for a non-numeric (number, integer) schema
 * 2) minimum <= maximum
 * 3) minItems/maxItems should not be defined for a non-array schema
 * 4) minItems <= maxItems
 * 5) minProperties/maxProperties should not be defined for a non-object schema
 * 6) minProperties <= maxProperties
 *
 * @param {*} schema the schema to check
 * @param {*} path the array of path segments indicating the "location" of the schema within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function checkPropertyAttributes(schema, path) {
  const errors = [];

  if (isNumericSchema(schema)) {
    // 2) minimum <= maximum
    if (schema.minimum && schema.maximum && schema.minimum > schema.maximum) {
      errors.push({
        message: 'minimum cannot be greater than maximum',
        path: [...path, 'minimum']
      });
    }
  } else {
    // 1) minimum/maximum should not be defined for a non-numeric (number, integer) schema
    if (schema.minimum) {
      errors.push({
        message: 'minimum should not be defined for a non-numeric schema',
        path: [...path, 'minimum']
      });
    }
    if (schema.maximum) {
      errors.push({
        message: 'maximum should not be defined for a non-numeric schema',
        path: [...path, 'maximum']
      });
    }
  }

  if (isArraySchema(schema)) {
    // 4) minItems <= maxItems
    if (
      schema.minItems &&
      schema.maxItems &&
      schema.minItems > schema.maxItems
    ) {
      errors.push({
        message: 'minItems cannot be greater than maxItems',
        path: [...path, 'minItems']
      });
    }
  } else {
    // 3) minItems/maxItems should not be defined for a non-array schema
    if (schema.minItems) {
      errors.push({
        message: 'minItems should not be defined for a non-array schema',
        path: [...path, 'minItems']
      });
    }
    if (schema.maxItems) {
      errors.push({
        message: 'maxItems should not be defined for a non-array schema',
        path: [...path, 'maxItems']
      });
    }
  }

  if (isObjectSchema(schema)) {
    // 6) minProperties <= maxProperties
    if (
      schema.minProperties &&
      schema.maxProperties &&
      schema.minProperties > schema.maxProperties
    ) {
      errors.push({
        message: 'minProperties cannot be greater than maxProperties',
        path: [...path, 'minProperties']
      });
    }
  } else {
    // 5) minProperties/maxProperties should not be defined for a non-object schema
    if (schema.minProperties) {
      errors.push({
        message: 'minProperties should not be defined for a non-object schema',
        path: [...path, 'minProperties']
      });
    }
    if (schema.maxProperties) {
      errors.push({
        message: 'maxProperties should not be defined for a non-object schema',
        path: [...path, 'maxProperties']
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
