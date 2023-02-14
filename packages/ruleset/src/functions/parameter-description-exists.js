const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function(param, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.newInstance().getLogger(ruleId);
  }
  return parameterDescription(param, context.path);
};

function parameterDescription(param, path) {
  logger.debug(
    `${ruleId}: checking parameter '${param.name}' at location: ${path.join(
      '.'
    )}`
  );

  if (!paramHasDescription(param)) {
    logger.debug(`${ruleId}: no description found!`);
    return [
      {
        message: 'Parameter should have a non-empty description',
        path
      }
    ];
  }

  return [];
}

function paramHasDescription(param) {
  return param.description && param.description.toString().trim().length;
}
