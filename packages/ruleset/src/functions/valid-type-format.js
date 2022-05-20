const { validateSubschemas } = require('../utils');

// Valid schema types.
const validTypes = [
  'array',
  'boolean',
  'integer',
  'number',
  'object',
  'string'
];

// Valid format values for selected schema types.
const validIntegerFormats = ['int32', 'int64'];
const validNumberFormats = ['float', 'double'];
const validStringFormats = [
  'binary',
  'byte',
  'crn',
  'date',
  'date-time',
  'email',
  'identifier',
  'password',
  'url',
  'uuid'
];

// Pre-define some error messages that we can re-use later.
const formatButNoTypeErrorMsg = 'Format defined without a type.';
const invalidTypeErrorMsg = `Invalid type. Valid types are: ${validTypes.join(
  ', '
)}.`;
const integerFormatErrorMsg = `Schema of type integer should use one of the following formats: ${validIntegerFormats.join(
  ', '
)}.`;
const numberFormatErrorMsg = `Schema of type number should use one of the following formats: ${validNumberFormats.join(
  ', '
)}.`;
const stringFormatErrorMsg = `Schema of type string should use one of the following formats: ${validStringFormats.join(
  ', '
)}.`;

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, typeFormatErrors);
};

function typeFormatErrors(schema, path) {
  const errors = [];

  // It's ok to have a schema with no type, but we need to
  // make sure that format isn't defined in that case.
  if (!schema.type) {
    if (schema.format) {
      errors.push({
        message: formatButNoTypeErrorMsg,
        path
      });
    }
  } else if (typeof schema.type === 'string') {
    // Make sure that 'type' is a string before we start using it as such.
    // If it isn't, we'll simply ignore this schema because a different rule
    // will detect the incorrect 'type' property.

    // Type is defined and is a string, so let's first make sure that it is a valid type.
    if (!validTypes.includes(schema.type.toLowerCase())) {
      errors.push({
        message: invalidTypeErrorMsg,
        path
      });
    } else {
      // Type is valid, let's make sure format is valid for this type.
      switch (schema.type) {
        case 'integer':
          if (
            schema.format &&
            !validIntegerFormats.includes(schema.format.toLowerCase())
          ) {
            errors.push({
              message: integerFormatErrorMsg,
              path
            });
          }
          break;
        case 'number':
          if (
            schema.format &&
            !validNumberFormats.includes(schema.format.toLowerCase())
          ) {
            errors.push({
              message: numberFormatErrorMsg,
              path
            });
          }
          break;
        case 'string':
          if (
            schema.format &&
            !validStringFormats.includes(schema.format.toLowerCase())
          ) {
            errors.push({
              message: stringFormatErrorMsg,
              path
            });
          }
          break;
        case 'boolean':
        case 'object':
        case 'array':
          // No valid formats for boolean, format should be undefined
          if (schema.format !== undefined) {
            errors.push({
              message: `Schema of type ${schema.type} should not have a format.`,
              path
            });
          }
          break;
      }
    }
  }
  return errors;
}
