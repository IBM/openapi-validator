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

  return redirectResponseBody(
    operation,
    context.path,
    getResolvedSpec(context)
  );
};

/**
 * This function performs a few checks on each operation's response field:
 * 1.  Only status codes 301, 302, 305, 307 should include a response body for 30x response codes.
 * 2.  Every response body for status codes 30x should contain a value for code that matches on of the following values:
 *     forwarded, resolved, moved, remote_region, remote_account, version_mismatch.
 * 3.  Every response body for status codes 30x should include "code" property.
 * 4.  Every response body for status codes 30x should include "message" property.
 * 5.  Every response body for status codes 30x should include "target" property.
 * @param {*} operation an operation within the API definition.
 * @param {*} path the array of path segments indicating the "location" of the operation within the API definition.
 */
function redirectResponseBody(operation, path) {
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
    const redirectCodes = [
      'forwarded',
      'resolved',
      'moved',
      'remote_region',
      'remote_account',
      'version_mismatch',
    ];

    const redirectResponses = statusCodes.filter(code => code.startsWith('3'));
    if (redirectResponses.length) {
      const responseCodes = redirectResponses.filter(
        code => !responseCodesWithBody.includes(code)
      );

      // 1. Only status codes 301, 302, 305, 307 should include a response body for 30x response codes.
      responseCodes.forEach(responseCode => {
        const response = operation.responses[responseCode];
        if (response && response.content) {
          errors.push({
            message:
              'Only a 301, 302, 305, 307 response should include a response body',
            path: [...path, 'responses'],
          });
        }
      });

      responseCodesWithBody.forEach(code => {
        const response = operation.responses[code];
        if (response && response.content) {
          const applicationJson = response.content['application/json'];

          if (!applicationJson) return;

          const redirectCode = applicationJson['code'];
          const message = applicationJson['message'];
          const target = applicationJson['target'];

          // 2. Every response body for status codes 30x should contain a value for code that matches one of the following values:
          //    forwarded, resolved, moved, remote_region, remote_account, version_mismatch.
          // 3. Every response body for status codes 30x should include "code" property.
          if (redirectCode) {
            for (let i = 0; i < redirectCodes.length; i++) {
              if (redirectCode == redirectCodes[i]) break;
              else if (i === redirectCodes.length - 1) {
                errors.push({
                  message: `Redirect code should match one of the following: ${redirectCodes.join(
                    ' or '
                  )}`,
                  path: [...path, 'responses'],
                });
              }
            }
          } else {
            errors.push({
              message:
                'Response body for response codes 301, 302, 305 and 307 should include "code" field',
              path: [...path, 'responses'],
            });
          }

          // 4. Every response body for status codes 30x should include "message" property.
          if (!message)
            errors.push({
              message:
                'Response body for response codes 301, 302, 305 and 307 should include "message" field',
              path: [...path, 'responses'],
            });

          // 5. Every response body for status codes 30x should include "target" property.
          if (!target)
            errors.push({
              message:
                'Response body for response codes 301, 302, 305 and 307 should include "target" field',
              path: [...path, 'responses'],
            });
        }
      });
    }
  }

  return errors;
}
