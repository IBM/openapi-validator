/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

/**
 * The implementation for this rule makes assumptions that are dependent on the
 * presence of the following other rules:
 *
 * - operation-summary: all operations define a non-empty summary
 */

module.exports = function (summary, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return checkSummaryLength(summary, context.path);
};

function checkSummaryLength(summary, path) {
  logger.debug(
    `${ruleId}: checking operation summary at location: ${path.join('.')}`
  );

  if (summary && summary.length > 80) {
    return [
      {
        message: 'Operation summaries must be 80 characters or less in length',
        path,
      },
    ];
  }

  return [];
}
