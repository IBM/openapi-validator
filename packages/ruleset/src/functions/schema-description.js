const {
  validateSubschemas,
  pathMatchesRegexp,
  checkCompositeSchemaForConstraint
} = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, schemaDescription);
};

function schemaDescription(schema, path) {
  // If "schema" is a $ref, that means it didn't get resolved
  // properly (perhaps due to a circular ref), so just ignore it.
  if (schema.$ref) {
    return [];
  }

  //
  // Check to see if "path" represents a primary schema (i.e. not a schema property).
  // Note: the regexp used below uses a "lookbehind assertion"
  // (i.e. the "(?<!,parameters,\d+)" part) to match paths that end with the "schema" part,
  // but not paths where "schema" is preceded by "parameters" and "<digits>".
  // So a primary schema is one with a path like:
  // ["paths", "/v1/drinks", "requestBody", "content", "application/json", "schema"]
  // but not one with a path like these:
  // ["paths", "/v1/drinks", "parameters", "0", "schema"]
  // ["paths", "/v1/drinks", "requestBody", "content", "application/json", "schema", "properties", "prop1"]
  //
  const isPrimarySchema = pathMatchesRegexp(
    path,
    /^.*(?<!,parameters,\d+),schema$/
  );
  // If "schema" is a primary schema, then check for a description.
  if (isPrimarySchema && !schemaHasDescription(schema)) {
    return [
      {
        message: 'Schema should have a non-empty description',
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
