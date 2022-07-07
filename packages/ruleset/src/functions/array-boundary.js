const { validateSubschemas } = require('../utils');
const { getSchemaType } = require('../utils');
const { SchemaType } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, arrayBoundaryErrors, true, false);
};

const debugEnabled = false;
function debug(msg) {
  if (debugEnabled) {
    console.log(msg);
  }
}

function arrayBoundaryErrors(schema, path) {
  const errors = [];

  if (getSchemaType(schema) === SchemaType.ARRAY) {
    if (isUndefinedOrNull(schema.minItems)) {
      errors.push({
        message: 'Should define a minItems for a valid array',
        path
      });
      debug('>>> minItems field missing for: ' + path.join('.'));
    }
    if (isUndefinedOrNull(schema.maxItems)) {
      errors.push({
        message: 'Should define a maxItems for a valid array',
        path
      });
      debug('>>> maxItems field missing for: ' + path.join('.'));
    }
  } else {
    if (schema.minItems) {
      errors.push({
        message: 'minItems should not be defined for a non-array schema',
        path: [...path, 'minItems']
      });
      debug('>>> ' + schema.type + ' minItems should not be defined for a non-array schema for: ' + path.join('.'));
    }
    if (schema.maxItems) {
      errors.push({
        message: 'maxItems should not be defined for a non-array schema',
        path: [...path, 'maxItems']
      });
      debug('>>> ' + schema.type + ' maxItems should not be defined for a non-array schema for: ' + path.join('.'));
    }
  }
  return errors;
}

function isUndefinedOrNull(obj) {
  return obj === undefined || obj === null;
}
