const { validateSubschemas } = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory, mergeAllOfSchemaProperties } = require('../utils');

let ruleId;
let logger;

module.exports = function(schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return validateSubschemas(schema, context.path, schemaTypeExists);
};

function schemaTypeExists(schema, path) {
  // If we're looking at an allOf list element schema, then
  // bail out as this would not necessarily provide the full
  // definition of a schema or schema property.
  if (path[path.length - 2] === 'allOf') {
    logger.debug(
      `${ruleId}: skipping type check for allOf member at location: ${path.join(
        '.'
      )}`
    );
    return [];
  }

  const mergedSchema = mergeAllOfSchemaProperties(schema);

  if (!schemaHasType(mergedSchema)) {
    logger.debug(
      `${ruleId}: schema with no type at location: ${path.join('.')}`
    );
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
