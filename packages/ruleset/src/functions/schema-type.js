const { validateSubschemas } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, schemaDescription);
};

function schemaDescription(schema, path) {
  // If "schema" is a $ref, that means it didn't get resolved
  // properly (perhaps due to a circular ref), so just ignore it.
  if (schema.$ref) {
    return [];
  }

  if (!schemaHasType(schema)) {
    return [
      {
        message: 'Schema should have a non-empty `type` field.',
        path
      }
    ];
  }

  return [];
}

function schemaHasType(s) {
  return s && s.type && s.type.toString().trim().length;
}
