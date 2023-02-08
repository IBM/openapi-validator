const {
  isArraySchema,
  validateSubschemas
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;
module.exports = function(schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.newInstance().getLogger(ruleId);
  }
  return validateSubschemas(schema, context.path, arrayOfArrays, true, false);
};

function arrayOfArrays(schema, path) {
  const errors = [];

  if (isArraySchema(schema) && schema.items) {
    logger.debug(
      `${ruleId}: checking array schema at location: ${path.join('.')}`
    );
    if (isArraySchema(schema.items)) {
      logger.debug('Found an array of arrays!');
      errors.push({
        message: 'Array schemas should avoid having items of type array.',
        path
      });
    }
  }

  return errors;
}
