const {
  validateSubschemas,
  pathMatchesRegexp,
  checkCompositeSchemaForConstraint,
  LoggerFactory
} = require('../utils');

let logger;
let ruleId;
module.exports = function(schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.newInstance().getLogger(ruleId);
  }
  return validateSubschemas(schema, context.path, schemaDescription);
};

function schemaDescription(schema, path) {
  logger.debug(`${ruleId}: checking path '${path.join('.')}'`);

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
    logger.debug(`${ruleId}: FAILED!`);
    return [
      {
        message: 'Schema should have a non-empty description',
        path
      }
    ];
  }

  logger.debug(`${ruleId}: PASSED!`);
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
