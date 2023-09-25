/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

const ErrorMsg =
  'An unsupported OpenAPI 3.1 keyword was found in the OpenAPI document:';

module.exports = function (apidef, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return noUnsupportedKeywords(apidef);
};

/**
 * If 'unevaluatedProperties' is specified within "schema" then it must be set to false.
 *
 * @param {*} apidef the API definition object
 * @returns an array of zero or more errors
 */
function noUnsupportedKeywords(apidef) {
  logger.debug(`${ruleId}: checking for unsupported OpenAPI 3.1 keywords`);

  const errors = [];

  if ('jsonSchemaDialect' in apidef) {
    logger.debug(`${ruleId}: found 'jsonSchemaDialect'`);
    errors.push({
      message: `${ErrorMsg} jsonSchemaDialect`,
      path: ['jsonSchemaDialect'],
    });
  }

  if ('webhooks' in apidef) {
    logger.debug(`${ruleId}: found 'webhooks`);
    errors.push({
      message: `${ErrorMsg} webhooks`,
      path: ['webhooks'],
    });
  }

  if (!errors.length) {
    logger.debug(`${ruleId}: PASSED!`);
  }
  return errors;
}
