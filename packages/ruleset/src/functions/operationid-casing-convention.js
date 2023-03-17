/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { casing } = require('@stoplight/spectral-functions');
const { LoggerFactory } = require('../utils');

let casingConfig;
let ruleId;
let logger;

module.exports = function (operation, options, context) {
  // Save this rule's "functionOptions" value since we need
  // to pass it on to Spectral's "casing" function.
  casingConfig = options;

  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return operationIdCaseConvention(operation, context.path);
};

function operationIdCaseConvention(operation, path) {
  // Bypass the check if the operationId value is missing (the existence
  // of an operationId value is checked by the 'operation-operationId' rule).
  const operationId =
    operation.operationId && operation.operationId.toString().trim();
  if (!operationId) {
    return [];
  }

  logger.debug(
    `${ruleId}: checking '${operationId}' vs casing config: ${JSON.stringify(
      casingConfig
    )}`
  );

  const result = casing(operationId, casingConfig);
  if (result) {
    logger.debug(`${ruleId}: failed casing check: ${JSON.stringify(result)}`);
    // Update the message to clarify that it is an operationId value that is incorrect,
    // and update the path.
    result[0].message = 'Operation ids ' + result[0].message;
    result[0].path = [...path, 'operationId'];
    return [result[0]];
  }

  return [];
}
