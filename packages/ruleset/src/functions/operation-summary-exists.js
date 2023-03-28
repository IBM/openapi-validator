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
  }
  return operationSummary(operation, context.path);
};

function operationSummary(operation, path) {
  logger.debug(
    `${ruleId}: checking summary for operation at location: ${path.join('.')}`
  );
  if (!operationHasSummary(operation)) {
    logger.debug(`${ruleId}: no summary found!`);
    return [
      {
        message: 'Operations must have a non-empty summary',

        // If the 'summary' field is defined, then include it in the error path.
        path: 'summary' in operation ? [...path, 'summary'] : path,
      },
    ];
  }

  return [];
}

function operationHasSummary(operation) {
  return operation.summary && operation.summary.toString().trim().length;
}
