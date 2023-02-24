const {
  schemaHasProperty,
  validateSubschemas
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function(schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return validateSubschemas(
    schema,
    context.path,
    checkRequiredProperties,
    true,
    false
  );
};

function checkRequiredProperties(schema, path) {
  const errors = [];
  if (Array.isArray(schema.required)) {
    logger.debug(
      `${ruleId}: checking for required properties in schema at location: ${path.join(
        '.'
      )}`
    );
    schema.required.forEach(function(requiredPropName) {
      if (!schemaHasProperty(schema, requiredPropName)) {
        let message;
        if (schema.allOf) {
          message = `Required property, ${requiredPropName}, must be defined in at least one of the allOf schemas`;
        } else if (schema.anyOf || schema.oneOf) {
          message = `Required property, ${requiredPropName}, must be defined in all of the anyOf/oneOf schemas`;
        } else {
          message = `Required property, ${requiredPropName}, not in the schema`;
        }
        logger.debug(`${ruleId}: Uh oh: ${message}`);
        errors.push({
          message,
          path
        });
      }
    });
  }
  return errors;
}
