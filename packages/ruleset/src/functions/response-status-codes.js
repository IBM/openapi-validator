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

  return responseStatusCodes(
    operation,
    context.path,
    context.document.parserResult.data
  );
};

/**
 * This function performs a few checks on each operation's responses field:
 * 1. Status code 400 should be used instead of 422.
 * 2. Status code 303 or 307 should be used instead of 302.
 * 3. Operation responses should include at least one successful (2xx) status code.
 * 4. Operation responses should not include status code 101 when successful (2xx) status codes are present.
 * 5. A 204 response must not have content.
 * 6. A "create" operation must return either a 201 or a 202.
 *    An operation is considered to be a "create" operation if the operationId starts with "create"
 *    OR it's a POST request and there is a similar path but with a trailing path parameter reference.
 * 7. If an operation returns status code 202, it should not return any other 2xx status codes.
 * @param {*} operation an operation within the API definition
 * @param {*} path the array of path segments indicating the "location" of the operation within the API definition
 * @param {*} apidef the resolved API spec
 * @returns an array containing the violations found or [] if no violations
 */
function responseStatusCodes(operation, path, apidef) {
  if (!operation.responses) {
    return [];
  }

  logger.debug(
    `${ruleId}: checking status codes for operation at location: ${path.join(
      '.'
    )}`
  );

  const errors = [];

  const [statusCodes, successCodes] = getResponseCodes(operation.responses);

  if (statusCodes.length) {
    // 1. Check for a 422.
    if (statusCodes.includes('422')) {
      errors.push({
        message:
          'Operation `responses` should use status code 400 instead of 422 for invalid request payloads.',
        path: [...path, 'responses', '422'],
      });
    }

    // 2. Check for a 302.
    if (statusCodes.includes('302')) {
      errors.push({
        message:
          'Operation `responses` should use status code 303 or 307 instead of 302.',
        path: [...path, 'responses', '302'],
      });
    }

    // 3. Make sure we have at least one success code.
    if (!successCodes.length && !('101' in operation.responses)) {
      errors.push({
        message:
          'Operation `responses` should include at least one success status code (2xx).',
        path: [...path, 'responses'],
      });
    }

    // 4. Make sure we don't have a 101 status code AND success codes.
    if (successCodes.length && '101' in operation.responses) {
      errors.push({
        message:
          'Operation `responses` should not include status code 101 when success status codes (2xx) are present.',
        path: [...path, 'responses', '101'],
      });
    }

    // 5. Make sure a 204 response (if present) doesn't have content.
    const response204 = operation.responses['204'];
    if (response204 && response204.content) {
      errors.push({
        message:
          'A 204 response must not include a response body. Use a different status code for responses with content.',
        path: [...path, 'responses', '204', 'content'],
      });
    }

    // 6. For a 'create' operation (a POST operation or operationId starts with "create"),
    // make sure that there's either a 201 or a 202 status code.
    if (isCreateOperation(operation, path, apidef)) {
      if (!successCodes.includes('201') && !successCodes.includes('202')) {
        errors.push({
          message:
            "A 201 or 202 status code should be returned by a 'create' operation.",
          path: [...path, 'responses'],
        });
      }
    }

    // 7. If an operation returns 202, it should not return any other success status codes.
    if (successCodes.includes('202') && successCodes.length > 1) {
      errors.push({
        message:
          'An operation that returns a 202 status code should not return any other 2xx status codes.',
        path: [...path, 'responses'],
      });
    }
  }

  if (errors.length) {
    logger.debug(
      `${ruleId}: found these errors:\n${JSON.stringify(errors, null, 2)}`
    );
  } else {
    logger.debug(`${ruleId}: PASSED!`);
  }

  return errors;
}

function isCreateOperation(operation, path, apidef) {
  // 1. If operationId starts with "create", we'll assume it's a create operation.
  if (
    operation.operationId &&
    operation.operationId.toString().trim().toLowerCase().startsWith('create')
  ) {
    return true;
  }

  // 2. If not a POST, then it's not a create operation.
  const method = path[path.length - 1].toString().trim().toLowerCase();
  if (method !== 'post') {
    return false;
  }

  // 3. Does this operation's path have a sibling path with a trailing path param reference?
  const thisPath = path[path.length - 2].toString().trim();
  const siblingPathRE = new RegExp(`^${thisPath}/{[^{}/]+}$`);
  const siblingPath = Object.keys(apidef.paths).find(p =>
    siblingPathRE.test(p)
  );

  return !!siblingPath;
}

function getResponseCodes(responses) {
  const statusCodes = Object.keys(responses).filter(code =>
    code.match(/^[1-5][0-9][0-9]$/)
  );
  const successCodes = statusCodes.filter(code => code.match(/^2[0-9][0-9]$/));
  return [statusCodes, successCodes];
}
