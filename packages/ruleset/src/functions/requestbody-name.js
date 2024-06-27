/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isFormMimeType,
  isRequestBodyExploded,
  LoggerFactory,
} = require('../utils');

let ruleId;
let logger;

module.exports = function (operation, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return requestBodyName(operation, context.path);
};

// Name of the extension that we're looking for.
const EXTENSION_NAME = 'x-codegen-request-body-name';

/**
 * This function implements the 'request-body-name' rule.
 * Specifically, it checks to make sure that an operation
 * contains the 'x-codegen-request-body-name' extension if its requestBody
 * "needs" a name.
 * In this context, "needs a name" implies that the operation will have
 * a single body param and the request body is not being "exploded".
 *
 * @param {*} op the operation to check
 * @param {*} path the array of path segments indicating the "location" of "op" within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function requestBodyName(op, path) {
  logger.debug(
    `${ruleId}: checking operation '${op.operationId}' at location: ${path.join(
      '.'
    )}`
  );

  // If this operation needs a request body name, then check for one.
  if (
    op &&
    op.requestBody &&
    op.requestBody.content &&
    needRequestBodyName(op.requestBody)
  ) {
    logger.debug(
      `${ruleId}: operation needs the '${EXTENSION_NAME}' extension.`
    );

    const hasRequestBodyName =
      op[EXTENSION_NAME] && op[EXTENSION_NAME].trim().length;

    if (!hasRequestBodyName) {
      logger.debug(`${ruleId}: extension not foud!`);

      return [
        {
          message: `Operations with non-form request bodies should set a name with the '${EXTENSION_NAME}' extension`,
          path,
        },
      ];
    } else {
      logger.debug(`${ruleId}: found the extension!`);
    }
  } else {
    logger.debug(
      `${ruleId}: operation doesn't need the '${EXTENSION_NAME}' extension.`
    );
  }

  return [];
}

/**
 * Returns true if and only if "requestBody" should have a request body name specified for it.
 * This will be true IF there is requestBody content and we won't be exploding the body.
 * @param {*} requestBody the operation's requestBody field
 */
function needRequestBodyName(requestBody) {
  const content = requestBody.content;
  const mimeTypes = Object.keys(content);
  if (!mimeTypes.length) {
    return false;
  }

  // Request body has content for at least one mimetype,
  // so let's check if the body will be exploded by the SDK generator.
  const bodyWillBeExploded = isRequestBodyExploded(requestBody);

  const hasFormContent = mimeTypes.find(m => isFormMimeType(m));

  logger.debug(
    `${ruleId}: bodyWillBeExploded=${!!bodyWillBeExploded}, hasFormContent=${!!hasFormContent}`
  );

  return !bodyWillBeExploded && !hasFormContent;
}
