const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function(operation, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.newInstance().getLogger(ruleId);
  }
  return deleteBody(operation, context.path);
};

// This rule warns about a delete operation if it has a requestBody.
function deleteBody(operation, path) {
  logger.debug(`${ruleId}: checking operation located at: ${path.join('.')}`);

  // Grab the http method from the end of the path.
  const method = path[path.length - 1].trim().toLowerCase();

  // Return a warning if we're looking at a "delete" that has a requestBody.
  if (method === 'delete' && 'requestBody' in operation) {
    logger.debug(`Found delete operation with a request body!`);
    return [
      {
        message: '"delete" operation should not contain a requestBody.',
        path: [...path, 'requestBody']
      }
    ];
  }

  return [];
}
