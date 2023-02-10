const { validateSubschemas } = require('@ibm-cloud/openapi-ruleset-utilities');

const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function(schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.newInstance().getLogger(ruleId);
  }
  return validateSubschemas(schema, context.path, descriptionMentionsJSON);
};

const errorMsg = 'Schema descriptions should avoid mentioning "JSON"';

function descriptionMentionsJSON(schema, path) {
  logger.debug(
    `${ruleId}: checking description of schema at location: ${path.join('.')}`
  );

  const results = [];

  if (
    schema.description &&
    schema.description
      .toString()
      .toLowerCase()
      .includes('json')
  ) {
    logger.debug('Found JSON reference!');
    results.push({
      message: errorMsg,
      path
    });
  }

  return results;
}
