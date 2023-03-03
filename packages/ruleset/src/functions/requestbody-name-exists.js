/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isArraySchema } = require('@ibm-cloud/openapi-ruleset-utilities');
const {
  isJsonMimeType,
  isFormMimeType,
  isJsonPatchMimeType,
  isMergePatchMimeType,
  LoggerFactory
} = require('../utils');

let ruleId;
let logger;

module.exports = function(operation, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return requestBodyNameExists(operation, context.path);
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
function requestBodyNameExists(op, path) {
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
          message: `Operation with non-form requestBody should set a name with the ${EXTENSION_NAME} extension.`,
          path
        }
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
  // so let's check if the body will be exploded.

  // Does the operation support JSON content?
  const jsonMimeType = mimeTypes.find(
    m => isJsonMimeType(m) || isJsonPatchMimeType(m) || isMergePatchMimeType(m)
  );

  // Does the operation support non-JSON content?
  const hasNonJsonContent = mimeTypes.find(
    m =>
      !isJsonMimeType(m) && !isJsonPatchMimeType(m) && !isMergePatchMimeType(m)
  );

  // Grab the requestBody schema for the JSON mimetype (if present).
  const bodySchema = jsonMimeType && content[jsonMimeType].schema;

  // Is the request body schema an array?
  const isArrayBody = bodySchema && isArraySchema(bodySchema);

  // Does the schema contain oneOf/anyOf?
  const isAbstract = isSchemaAbstract(bodySchema);

  // Does the schema support additionalProperties?
  const isDynamic = isSchemaDynamic(bodySchema);

  // Does the schema have a discriminator?
  const hasDiscriminator = bodySchema && bodySchema.discriminator;

  // Does the request body have just a single mimetype?
  const hasSingleMimeType = mimeTypes.length === 1;

  // Determine if the request body will be exploded by the SDK generator.
  const bodyWillBeExploded =
    bodySchema &&
    hasSingleMimeType &&
    !isArrayBody &&
    !hasNonJsonContent &&
    !isAbstract &&
    !isDynamic &&
    !hasDiscriminator;

  const hasFormContent = mimeTypes.find(m => isFormMimeType(m));

  logger.debug(
    `${ruleId}: bodyWillBeExploded=${!!bodyWillBeExploded}, hasFormContent=${!!hasFormContent}`
  );

  return !bodyWillBeExploded && !hasFormContent;
}

/**
 * Returns true if and only if "schema" supports additional properties.
 * @param {*} schema the schema to check
 * @returns true if "schema" supports additional properties.
 */
function isSchemaDynamic(schema) {
  const hasAdditionalProperties = schema && schema.additionalProperties;
  return hasAdditionalProperties;
}

/**
 * Returns true if and only if "schema" contains a oneOf or anyOf list.
 * @param {object} schema the schema to check
 * @returns true if "schema" contains oneOf or anyOf.
 */
function isSchemaAbstract(schema) {
  if (schema && schema.oneOf && schema.oneOf.length) {
    return true;
  }
  if (schema && schema.anyOf && schema.anyOf.length) {
    return true;
  }
  return false;
}
