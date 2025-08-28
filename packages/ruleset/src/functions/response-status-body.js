/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getResolvedSpec } = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory, getResponseCodes } = require('../utils');

let ruleId;
let logger;

module.exports = function (operation, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return responseStatusBody(operation, context.path, getResolvedSpec(context));
};

function responseStatusBody(operation, path) {
  if (!operation.responses) {
    return [];
  }

  logger.debug(
    `${ruleId}: checking response bodies for operation at location: ${path.join(
      '.'
    )}`
  );

  const errors = [];

  const [statusCodes] = getResponseCodes(operation.responses);

  if (statusCodes.length) {
    const responseCodesWithBody = ['301', '302', '305', '307'];

    const responses = statusCodes.filter(code => code.startsWith('3'));
    if (responses.length) {
      const responseCode = responses.filter(
        code => !responseCodesWithBody.includes(code)
      );
      const response = operation.responses[responseCode];
      if (response && response.content) {
        errors.push({
          message:
            'Only a 301, 302, 305, 307 response should include a response body',
          path: [...path, 'responses'],
        });
      }
    }

    const responseWithBody = responseCodesWithBody.find(
      code => operation.responses[code]
    );
    if (responseStatusBody && responseWithBody.content) {
      console.log('k');
    }
  }

  return errors;
}
