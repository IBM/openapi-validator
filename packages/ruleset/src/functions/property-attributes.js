const {
  validateSubschemas,
  isNumberSchema,
  isIntegerSchema,
  isFloatSchema,
  isDoubleSchema,
  isArraySchema,
  isObjectSchema,
  LoggerFactory
} = require('../utils');

let logger;
let ruleId;
module.exports = function(schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.newInstance().getLogger(ruleId);
  }
  return validateSubschemas(schema, context.path, checkPropertyAttributes);
};

/**
 * This rule performs the following checks on each schema (and schema property)
 * found in the API definition:
 * 1) minimum/maximum should not be defined for a non-numeric (number, integer) schema
 * 2) minimum <= maximum
 * 3) minItems/maxItems should not be defined for a non-array schema
 * 4) minItems <= maxItems
 * 5) minProperties/maxProperties should not be defined for a non-object schema
 * 6) minProperties <= maxProperties
 *
 * @param {*} schema the schema to check
 * @param {*} path the array of path segments indicating the "location" of the schema within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function checkPropertyAttributes(schema, path) {
  logger.debug(`${ruleId}: checking path '${path.join('.')}'`);

  const errors = [];

  if (isNumericSchema(schema)) {
    logger.debug(`${ruleId}: isNumericSchema true`);

    // 2) minimum <= maximum
    if (schema.minimum && schema.maximum && schema.minimum > schema.maximum) {
      logger.debug(`${ruleId}: Failed minimum/maximum check!`);
      errors.push({
        message: 'minimum cannot be greater than maximum',
        path: [...path, 'minimum']
      });
    }
  } else {
    logger.debug(`${ruleId}: isNumericSchema false`);

    // 1) minimum/maximum should not be defined for a non-numeric (number, integer) schema
    if (schema.minimum) {
      logger.debug(`${ruleId}: Found minimum for non-numeric schema!`);
      errors.push({
        message: 'minimum should not be defined for a non-numeric schema',
        path: [...path, 'minimum']
      });
    }
    if (schema.maximum) {
      logger.debug(`${ruleId}: Found maximum for non-numeric schema!`);
      errors.push({
        message: 'maximum should not be defined for a non-numeric schema',
        path: [...path, 'maximum']
      });
    }
  }

  if (isArraySchema(schema)) {
    logger.debug(`${ruleId}: isArraySchema true`);

    // 4) minItems <= maxItems
    if (
      schema.minItems &&
      schema.maxItems &&
      schema.minItems > schema.maxItems
    ) {
      logger.debug(`${ruleId}: Failed minItems/maxItems check!`);
      errors.push({
        message: 'minItems cannot be greater than maxItems',
        path: [...path, 'minItems']
      });
    }
  } else {
    logger.debug(`${ruleId}: isArraySchema false`);

    // 3) minItems/maxItems should not be defined for a non-array schema
    if (schema.minItems) {
      logger.debug(`${ruleId}: Found minItems for non-array schema!`);
      errors.push({
        message: 'minItems should not be defined for a non-array schema',
        path: [...path, 'minItems']
      });
    }
    if (schema.maxItems) {
      logger.debug(`${ruleId}: Found maxItems for non-array schema!`);
      errors.push({
        message: 'maxItems should not be defined for a non-array schema',
        path: [...path, 'maxItems']
      });
    }
  }

  if (isObjectSchema(schema)) {
    logger.debug(`${ruleId}: isObjectSchema true`);

    // 6) minProperties <= maxProperties
    if (
      schema.minProperties &&
      schema.maxProperties &&
      schema.minProperties > schema.maxProperties
    ) {
      logger.debug(`${ruleId}: Failed minProperties/maxProperties check!`);
      errors.push({
        message: 'minProperties cannot be greater than maxProperties',
        path: [...path, 'minProperties']
      });
    }
  } else {
    logger.debug(`${ruleId}: isObjectSchema false`);

    // 5) minProperties/maxProperties should not be defined for a non-object schema
    if (schema.minProperties) {
      logger.debug(`${ruleId}: Found minProperties for non-object schema!`);
      errors.push({
        message: 'minProperties should not be defined for a non-object schema',
        path: [...path, 'minProperties']
      });
    }
    if (schema.maxProperties) {
      logger.debug(`${ruleId}: Found maxProperties for non-object schema!`);
      errors.push({
        message: 'maxProperties should not be defined for a non-object schema',
        path: [...path, 'maxProperties']
      });
    }
  }

  const finalState = errors.length > 0 ? 'FAILED!' : 'PASSED!';
  logger.debug(`${ruleId}: ${finalState}`);

  return errors;
}

function isNumericSchema(s) {
  return (
    isNumberSchema(s) ||
    isIntegerSchema(s) ||
    isFloatSchema(s) ||
    isDoubleSchema(s)
  );
}
