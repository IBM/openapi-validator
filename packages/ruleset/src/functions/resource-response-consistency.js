/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isEqual } = require('lodash');
const { isObject } = require('@ibm-cloud/openapi-ruleset-utilities');
const {
  getResourceSpecificSiblingPath,
  getResponseCodes,
  getSuccessResponseSchemaForOperation,
  isCreateOperation,
  isJsonMimeType,
  isOperationOfType,
  LoggerFactory,
} = require('../utils');

let ruleId;
let logger;

module.exports = function (operation, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return resourceResponseConsistency(
    operation,
    context.path,
    context.documentInventory.resolved
  );
};

/**
 * Checks that operations that create or update a resource should
 * return the same schema as the "GET" request for the resource.
 *
 * An operation is considered to be a "create" operation if the operationId
 * starts with "create" OR it's a POST request and there is a similar path
 * but with a trailing path parameter reference.
 *
 * An operation is considered to be an "update" operation if the method type
 * is "put" or "patch".
 *
 * @param {*} operation an operation within the API definition
 * @param {*} path the array of path segments indicating the "location" of the operation within the API definition
 * @param {*} apidef the resolved API spec
 * @returns an array containing the violations found or [] if no violations
 */
function resourceResponseConsistency(operation, path, apidef) {
  logger.debug(
    `${ruleId}: checking responses for operation at location: ${path.join('.')}`
  );

  // This rule only applies to POSTs if they are determined to be "create" operations.
  if (
    isOperationOfType('post', path) &&
    !isCreateOperation(operation, path, apidef)
  ) {
    // In this case, no need to check the responses.
    logger.debug(
      `${ruleId}: operation is not a "create", PUT, or PATCH - no need to check`
    );
    return [];
  }

  const canonicalSchema = getCanonicalSchema(path, apidef);

  // If the GET request does not define a schema in its response, there is nothing left to check.
  if (!canonicalSchema) {
    logger.debug(
      `${ruleId}: no response schema found for GET request - abandoning check for this operation`
    );
    return [];
  }

  // If there are no responses defined, there is nothing to check.
  // We validate for that issue elsewhere.
  if (!operation.responses) {
    logger.debug(
      `${ruleId}: no responses object found on operation at location: ${path.join(
        '.'
      )}`
    );
    return [];
  }

  const [, successCodes] = getResponseCodes(operation.responses);
  logger.debug(
    `${ruleId}: operation has the following successCodes codes: ${successCodes.join(
      ', '
    )}`
  );

  // If there are no success code responses, there is nothing to check.
  // We validate for that issue elsewhere.
  if (!successCodes || !successCodes.length) {
    logger.debug(
      `${ruleId}: no success codes found on operation at location: ${path.join(
        '.'
      )}`
    );
    return [];
  }

  const errors = [];

  // Check defined, synchronous success responses for schema content that is equivalent
  // to the canonical schema, as defined by the corresponding GET request.
  // Appropriate use of other codes that don't define body content, like 202 or 204,
  // is validated for elsewhere.
  ['200', '201'].forEach(code => {
    if (successCodes.includes(code)) {
      const successResponse = operation.responses[code];
      if (
        !isObject(successResponse) ||
        !successResponse.content ||
        !isObject(successResponse.content)
      ) {
        logger.debug(
          `${ruleId}: operation's ${code} response is missing a 'content' object, nothing to check`
        );

        // Return from this loop iteration (i.e. continue). We check for missing content elsewhere.
        return;
      }

      // Only checking JSON content objects that define a schema.
      Object.keys(successResponse.content)
        .filter(mimeType => isJsonMimeType(mimeType))
        .forEach(mimeType => {
          logger.debug(
            `${ruleId}: checking responses's ${mimeType} content object`
          );

          const jsonContent = successResponse.content[mimeType];
          if (!isObject(jsonContent) || !jsonContent.schema) {
            logger.debug(
              `${ruleId}: responses's ${mimeType} content is missing a 'schema' object, nothing to check`
            );

            // Return from this loop iteration (i.e. continue). We check for a missing schema elsewhere.
            return;
          }

          if (!isEqual(canonicalSchema, jsonContent.schema)) {
            logger.debug(
              `${ruleId}: success response schema for this operation does not match the corresponding GET response schema`
            );
            errors.push({
              message:
                'Operations on a resource should return the same schema as the resource "get" request',
              path: [...path, 'responses', code, 'content', mimeType, 'schema'],
            });
          }
        });
    }
  });

  if (errors.length === 0) {
    logger.debug(
      `${ruleId}: operation at location "${path.join('.')}" passed!`
    );
  }

  return errors;
}

function getCanonicalSchema(path, apidef) {
  const resourceSpecificPath = isOperationOfType('post', path)
    ? getResourceSpecificSiblingPath(path.at(-2), apidef)
    : // This is a PUT or PATCH and should already be on the path we need
      path.at(-2).trim();

  logger.debug(
    `${ruleId}: calculated resource-specific path to be "${resourceSpecificPath}"`
  );

  if (!resourceSpecificPath || !apidef.paths[resourceSpecificPath]) {
    logger.debug(
      `${ruleId}: resource-specific path "${resourceSpecificPath}" does not exist`
    );
    return;
  }

  const resourceGetOperation = apidef.paths[resourceSpecificPath].get;
  if (!resourceGetOperation) {
    logger.debug(
      `${ruleId}: no GET operation found at path "${resourceSpecificPath}"`
    );
    return;
  }

  const { schemaObject } = getSuccessResponseSchemaForOperation(
    resourceGetOperation,
    path
  );

  return schemaObject;
}
