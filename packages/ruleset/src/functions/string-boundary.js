const { validateSubschemas } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, stringBoundaryErrors);
};

function stringBoundaryErrors(schema, path) {
  const errors = [];
  if (schema.type !== 'string') {
    return errors;
  }
  if (isUndefinedOrNull(schema.enum)) {
    if (
      isUndefinedOrNull(schema.pattern) &&
      !['binary', 'date', 'date-time'].includes(schema.format)
    ) {
      errors.push({
        message: 'Should define a pattern for a valid string',
        path
      });
    }
    if (isUndefinedOrNull(schema.minLength)) {
      errors.push({
        message: 'Should define a minLength for a valid string',
        path
      });
    }
    if (isUndefinedOrNull(schema.maxLength)) {
      errors.push({
        message: 'Should define a maxLength for a valid string',
        path
      });
    }
    if (
      !isUndefinedOrNull(schema.minLength) &&
      !isUndefinedOrNull(schema.maxLength) &&
      schema.minLength > schema.maxLength
    ) {
      errors.push({
        message: 'minLength must be less than maxLength',
        path
      });
    }
  }
  return errors;
}

function isUndefinedOrNull(obj) {
  return obj === undefined || obj === null;
}
