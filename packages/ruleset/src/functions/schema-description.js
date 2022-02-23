const {
  validateSubschemas,
  pathMatchesRegexp,
  checkCompositeSchemaForConstraint
} = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, schemaDescription);
};

const errorMsgSchema = 'Schema should have a non-empty description';
const errorMsgProp = 'Schema property should have a non-empty description';

function schemaDescription(schema, path) {
  const results = [];

  // This rule is configured with "resolved=true", so we shouldn't be called
  // with a "ref" schema.

  // Use "path" to determine some characteristics of "schema".
  // We want this function to be called for all possible schema locations within
  // the API (except for those in components.schemas because resolved=true),
  // but there are specific types of schemas for which we do not want to
  // return a warning. For example, a oneOf/anyOf list element schema, or
  // a schema associated with a parameter object.
  // We're mainly interested in "primary" schemas and schema properties.
  // A "primary" schema is (loosely termed) a schema associated with a
  // requestBody/response or other location where the path ends in "schema".
  //
  // Note: the regexp used below to capture "isPrimarySchema" uses a "lookbehind assertion"
  // (i.e. the "(?<!,parameters,\d+)" part) to match paths that end with the "schema" part,
  // but not paths where "schema" is preceded by "parameters" and "<digits>".
  // So a primary schema is one with a path like:
  // ["paths", "/v1/drinks", "requestBody", "content", "application/json", "schema"]
  // but not one with a path like:
  // ["paths", "/v1/drinks", "parameters", "0", "schema"]
  //
  const isPrimarySchema = pathMatchesRegexp(
    path,
    /^.*(?<!,parameters,\d+),schema$/
  );
  const isSchemaProperty = pathMatchesRegexp(path, /^.*,properties,[^,]*$/);

  // If "schema" is a primary schema, then check for a description.
  if (isPrimarySchema && !schemaHasDescription(schema)) {
    results.push({
      message: errorMsgSchema,
      path
    });
  }

  // If "schema" is a schema property, then check for a description.
  if (isSchemaProperty && !schemaHasDescription(schema)) {
    results.push({
      message: errorMsgProp,
      path
    });
  }

  return results;
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
