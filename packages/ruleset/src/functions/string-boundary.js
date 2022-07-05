const { validateSubschemas } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, stringBoundaryErrors, true, false);
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
  minLength: ['date', 'identifier', 'url'],
  maxLength: ['date']
};

function stringBoundaryErrors(schema, path) {
  const errors = [];

  if (schema.type === 'string') {
    if (isUndefinedOrNull(schema.enum)) {
      if (
        isUndefinedOrNull(schema.minLength) &&
        !bypassFormats.minLength.includes(schema.format)
      ) {
        errors.push({
          message: 'Should define a minLength for a valid string',
          path
        });
        debug('>>> minLength field missing for: ' + path.join('.'));
      }
      if (
        isUndefinedOrNull(schema.maxLength) &&
        !bypassFormats.maxLength.includes(schema.format)
      ) {
        errors.push({
          message: 'Should define a maxLength for a valid string',
          path
        });
        debug('>>> maxLength field missing for: ' + path.join('.'));
      }
      if (
        !isUndefinedOrNull(schema.minLength) &&
        !isUndefinedOrNull(schema.maxLength) &&
        schema.minLength > schema.maxLength
      ) {
        errors.push({
          message: 'minLength cannot be greater than maxLength',
          path
        });
        debug('>>> minLength >= maxLength for: ' + path.join('.'));
      }
    }
  } else {
    // Make sure that string-related fields are not present in a non-string schema.
    if (schema.minLength) {
      errors.push({
        message: 'minLength should not be defined for a non-string schema',
        path: [...path, 'minLength']
      });
    }
    if (schema.maxLength) {
      errors.push({
        message: 'maxLength should not be defined for a non-string schema',
        path: [...path, 'maxLength']
      });
    }
  }
  return errors;
}

function isUndefinedOrNull(obj) {
  return obj === undefined || obj === null;
}
