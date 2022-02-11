const { validateSubschemas, pathMatchesRegexp } = require('../utils');

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
  // We're mainly interested in a "primary" schemas and schema properties.
  // A "primary" schema is (loosely termed) a schema associated with a
  // requestBody or response or other locations where the path ends in "schema".
  //
  // Note: for you English speakers (and Dustin :) ), the regexp used below to
  // capture "isPrimarySchema" uses a "lookbehind assertion"
  // (the "(?<!,parameters,\d+)" part) to match paths that end with the "schema" part,
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

function schemaHasDescription(schema) {
  return schema.description && schema.description.toString().trim().length;
}
