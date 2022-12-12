const { casing } = require('@stoplight/spectral-functions');
const { validateSubschemas, LoggerFactory } = require('../utils');

let casingConfig;
let logger;
let ruleId;

module.exports = function(schema, options, context) {
  // Save this rule's "functionOptions" value since we need
  // to pass it on to Spectral's "casing" function.
  casingConfig = options;

  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.newInstance().getLogger(ruleId);
  }
  return validateSubschemas(schema, context.path, checkPropertyCaseConvention);
};

function checkPropertyCaseConvention(schema, path) {
  if (schema.properties) {
    logger.debug(`${ruleId}: checking path '${path.join('.')}'`);

    const errors = [];
    for (const propName of Object.keys(schema.properties)) {
      // skip deprecated properties
      if (schema.properties[propName].deprecated === true) {
        continue;
      }

      const result = casing(propName, casingConfig);
      // 'casing' will only return 'undefined' or an array of length 1
      if (result) {
        // 'casing' only reports the message - add the path to it
        // the message itself isn't great either - add some detail to it
        result[0].message = 'Property names ' + result[0].message;
        result[0].path = [...path, 'properties', propName];
        errors.push(result[0]);
      }
    }

    if (errors.length) {
      logger.debug(`${ruleId}: FAILED!`);
      logger.debug(`Errors: ${JSON.stringify(errors, null, 2)}`);
    } else {
      logger.debug(`${ruleId}: PASSED!`);
    }

    return errors;
  }

  return [];
}
