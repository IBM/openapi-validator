const {
  validateSubschemas,
  pathMatchesRegexp,
  checkCompositeSchemaForConstraint
} = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, propertyDescription);
};

function propertyDescription(schema, path) {
  // If "schema" is a schema property, then check for a description.
  const isSchemaProperty = pathMatchesRegexp(path, /^.*,properties,[^,]*$/);
  if (isSchemaProperty && !schemaHasDescription(schema)) {
    return [
      {
        message: 'Schema property should have a non-empty description',
        path
      }
    ];
  }

  return [];
}

// This function will return true if one of the following is true:
// 1. 'schema' has a non-empty description.
// 2. 'schema' has an allOf list and AT LEAST ONE list element schema has a non-empty description.
// 3. 'schema' has a oneOf or anyOf list and ALL of the list element schemas
//    have a non-empty description.
function schemaHasDescription(schema) {
  return checkCompositeSchemaForConstraint(
    schema,
    s => s && s.description && s.description.toString().trim().length
  );
}
