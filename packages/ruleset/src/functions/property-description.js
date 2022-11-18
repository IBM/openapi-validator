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
  return validateSubschemas(schema, context.path, propertyDescription);
};

function propertyDescription(schema, path) {
  logger.debug(`${ruleId}: checking path '${path.join('.')}'`);

  // If "schema" is a schema property, then check for a description.
  const isSchemaProperty = pathMatchesRegexp(path, /^.*,properties,[^,]*$/);
  if (isSchemaProperty && !schemaHasDescription(schema)) {
    logger.debug(`${ruleId}: FAILED!`);
    return [
      {
        message: 'Schema property should have a non-empty description',
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
