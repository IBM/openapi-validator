const { validateSubschemas } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, stringPatternErrors, true, false);
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
  pattern: ['binary', 'byte', 'date', 'date-time', 'url']
};

function stringPatternErrors(schema, path) {
  const errors = [];

  if (schema.type === 'string') {
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
    }
  } else {
    // Make sure that string-related fields are not present in a non-string schema.
    if (schema.pattern) {
      errors.push({
        message: 'pattern should not be defined for a non-string schema',
        path: [...path, 'pattern']
      });
    }
  }
  return errors;
}

function isUndefinedOrNull(obj) {
  return obj === undefined || obj === null;
}
