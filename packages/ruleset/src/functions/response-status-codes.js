/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getResolvedSpec } = require('@ibm-cloud/openapi-ruleset-utilities');
const {
  LoggerFactory,
  isCreateOperation,
  isOperationOfType,
  getResourceSpecificSiblingPath,
  getResponseCodes,
  pathHasMinimallyRepresentedResource,
} = require('../utils');

let ruleId;
let logger;

module.exports = function (operation, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return responseStatusCodes(operation, context.path, getResolvedSpec(context));
};

/**
 * This function performs a few checks on each operation's responses field:
 * 1.  Status code 400 should be used instead of 422.
 * 2.  Status code 303 or 307 should be used instead of 302.
 * 3.  Operation responses should include at least one successful (2xx) status code.
 * 4.  Operation responses should not include status code 101 when successful (2xx) status codes are present.
 * 5.  A 204 response must not have content.
 * 6.  A "create" operation must return either a 201 or a 202 (or a 204, if the corresponding GET request returns a 204).
 *     An operation is considered to be a "create" operation if the operationId starts with "create"
 *     OR it's a POST request and there is a similar path but with a trailing path parameter reference.
 * 7.  A "PUT" operation must return either a 200, 201, or 202
 * 8.  A "PATCH" operation must return either a 200 or a 202
 * 9.  If an operation returns status code 202, it should not return any other 2xx status codes.
 * 10. Status codes 301, 302, 305, 307 should include a response body.
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
          'Operation responses should use status code 400 instead of 422 for invalid request payloads',
        path: [...path, 'responses', '422'],
      });
    }

    // 2. Check for a 302.
    if (statusCodes.includes('302')) {
      errors.push({
        message:
          'Operation responses should use status code 303 or 307 instead of 302',
        path: [...path, 'responses', '302'],
      });
    }

    // 3. Make sure we have at least one success code.
    if (!successCodes.length && !('101' in operation.responses)) {
      errors.push({
        message:
          'Operation responses should include at least one success status code (2xx)',
        path: [...path, 'responses'],
      });
    }

    // 4. Make sure we don't have a 101 status code AND success codes.
    if (successCodes.length && '101' in operation.responses) {
      errors.push({
        message:
          'Operation responses should not include status code 101 when success status codes (2xx) are present',
        path: [...path, 'responses', '101'],
      });
    }

    // 5. Make sure a 204 response (if present) doesn't have content.
    const response204 = operation.responses['204'];
    if (response204 && response204.content) {
      errors.push({
        message:
          'A 204 response must not include a response body; use a different status code for responses with content',
        path: [...path, 'responses', '204', 'content'],
      });
    }

    // 6. For a 'create' operation (a POST operation or operationId starts with "create"),
    // make sure that there's either a 201 or a 202 status code - the exception is that a
    // 'create' is allowed to define a 204 if the corresponding GET request also defines
    // a 204, indicating there is no canonical body representation.
    if (isCreateOperation(operation, path, apidef)) {
      // If the create has a 204, and the GET has a 204, it's okay - no error
      if (
        !['201', '202'].find(code => successCodes.includes(code)) &&
        !(successCodes.includes('204') && !hasBodyRepresentation(path, apidef))
      ) {
        errors.push({
          message: `A 201 or 202 status code should be returned by a 'create' operation`,
          path: [...path, 'responses'],
        });
      }
    }

    // 7. A "PUT" operation must return either a 200, 201, or 202.
    // Exception: we'll also allow a 204 status code if there's a corresponding GET
    // operation that also returns a 204.
    // Note: we've already checked for lack of any success codes - no need to double-report that.
    if (isOperationOfType('put', path) && successCodes.length) {
      if (
        !['200', '201', '202'].find(code => successCodes.includes(code)) &&
        !(
          successCodes.includes('204') &&
          pathHasMinimallyRepresentedResource(path.at(-2), apidef)
        )
      ) {
        errors.push({
          message: `PUT operations should return a 200, 201, or 202 status code`,
          path: [...path, 'responses'],
        });
      }
    }

    // 8. A "PATCH" operation must return either a 200 or a 202
    // Note: we've already checked for lack of any success codes - no need to double-report that.
    if (isOperationOfType('patch', path) && successCodes.length) {
      if (!['200', '202'].find(code => successCodes.includes(code))) {
        errors.push({
          message: `PATCH operations should return a 200 or 202 status code`,
          path: [...path, 'responses'],
        });
      }
    }

    // 9. If an operation returns 202, it should not return any other success status codes.
    if (successCodes.includes('202') && successCodes.length > 1) {
      errors.push({
        message:
          'An operation that returns a 202 status code should not return any other 2xx status codes',
        path: [...path, 'responses'],
      });
    }

    //10. Status codes 301, 302, 305, 307 should include a response body.
    ['301', '302', '305', '307'].forEach(code => {
      const response30x = operation.responses[code];

      if (response30x && !response30x.content) {
        errors.push({
          message:
            'A 301, 302, 305 or 307 response should include a response body, use a different status code for responses without content',
          path: [...path, 'responses'],
        });
      }
    });
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

function hasBodyRepresentation(path, apidef) {
  const resourceSpecificPath = getResourceSpecificSiblingPath(
    path.at(-2),
    apidef
  );

  logger.debug(
    `${ruleId}: calculated resource-specific path to be "${resourceSpecificPath}"`
  );

  if (!resourceSpecificPath || !apidef.paths[resourceSpecificPath]) {
    logger.debug(
      `${ruleId}: resource-specific path "${resourceSpecificPath}" does not exist`
    );
    return;
  }

  return !pathHasMinimallyRepresentedResource(resourceSpecificPath, apidef);
}
