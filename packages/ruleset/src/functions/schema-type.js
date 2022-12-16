const { validateSubschemas } = require('@ibm-cloud/openapi-ruleset-utilities');
const { mergeAllOfSchemaProperties } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, schemaType);
};

function schemaType(schema, path) {
  // If we're looking at an allOf list element schema, then
  // bail out as this would not necessarily provide the full
  // definition of a schema or schema property.
  if (path[path.length - 2] === 'allOf') {
    return [];
  }

  const mergedSchema = mergeAllOfSchemaProperties(schema);

  if (!schemaHasType(mergedSchema)) {
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
