/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (operation, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);

    // This rule has been deprecated and is disabled by default (i.e. severity set to 'off'),
    // but spectral will still invoke the rule despite the severity setting.
    // If a user enables this rule in their custom ruleset, we'll want to log a warning
    // to alert them to the deprecation status.
    if (context.rule && context.rule.definition) {
      const severity = context.rule.definition.severity;
      if (
        (typeof severity === 'number' && severity >= 0) ||
        (typeof severity === 'string' && severity !== 'off')
      ) {
        logger.warn(
          `The '${ruleId}' rule is deprecated.  Please use the 'ibm-no-operation-requestbody' rule instead.`
        );
      }
    }
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
        message: 'DELETE operations should not contain a requestBody',
        path: [...path, 'requestBody'],
      },
    ];
  }

  return [];
}
