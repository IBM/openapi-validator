const { validateSubschemas } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, stringBoundaryErrors);
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

function stringBoundaryErrors(schema, path) {
  // We're only interested in checking string properties.
  if (schema.type !== 'string') {
    return [];
  }

  const errors = [];
  if (isUndefinedOrNull(schema.enum)) {
    if (
      isUndefinedOrNull(schema.pattern) &&
      !bypassFormats.pattern.includes(schema.format)
    ) {
      errors.push({
        message: 'Should define a pattern for a valid string',
        path
      });
      debug('>>> pattern field missing for: ' + path.join('.'));
    }
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
        message: 'minLength must be less than maxLength',
        path
      });
      debug('>>> minLength >= maxLength for: ' + path.join('.'));
    }
  }
  return errors;
}

function isUndefinedOrNull(obj) {
  return obj === undefined || obj === null;
}
