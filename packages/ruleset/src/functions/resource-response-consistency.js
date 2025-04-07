/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isEqual } = require('lodash');
const {
  isObject,
  getResolvedSpec,
  getNodes,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const {
  computeRefsAtPaths,
  getResourceSpecificSiblingPath,
  getResponseCodes,
  getSchemaNameAtPath,
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
    getResolvedSpec(context),
    getNodes(context)
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
 * @param {*} nodes the spectral-computed graph nodes mapping paths to referenced schemas
 * @returns an array containing the violations found or [] if no violations
 */
function resourceResponseConsistency(operation, path, apidef, nodes) {
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

  const pathToReferencesMap = computeRefsAtPaths(nodes);

  // If we're dealing with a PUT operation on a collection path, assume it is a
  // bulk operation that should return a collection schema for response consistency.
  if (
    isOperationOfType('put', path) &&
    isCollectionPath(path, apidef, pathToReferencesMap)
  ) {
    logger.debug(
      `${ruleId}: assuming PUT request is a bulk operation due to it being on the collection path`
    );

    // Check response of bulk PUT operation against the collection schema.
    const { schemaObject, schemaName } = getCollectionSchema(
      path,
      apidef,
      pathToReferencesMap
    );
    let message =
      'Bulk resource operations should return the resource collection schema';
    if (schemaName) {
      message += `: ${schemaName}`;
    }
    return checkAgainstSchema(schemaObject, operation, path, message);
  }

  // Check response against the canonical schema.
  const { schemaObject, schemaName } = getCanonicalSchema(
    path,
    apidef,
    pathToReferencesMap
  );
  let message =
    'Operations on a single resource instance should return the resource canonical schema';
  if (schemaName) {
    message += `: ${schemaName}`;
  }
  return checkAgainstSchema(schemaObject, operation, path, message);
}

function checkAgainstSchema(schema, operation, path, message) {
  // If the GET request does not define a schema in its response, there is nothing left to check.
  if (!schema) {
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

          if (!isEqual(schema, jsonContent.schema)) {
            logger.info(
              `${ruleId}: at least one success response schema for operation at path '${path}' does not match the corresponding GET response schema`
            );
            errors.push({
              message,
              path: [...path, 'responses', code, 'content', mimeType],
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

function getCanonicalSchema(path, apidef, pathToReferencesMap) {
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
    return {};
  }

  return getSchemaInfo(resourceSpecificPath, apidef, pathToReferencesMap);
}

function getCollectionSchema(operationPath, apidef, pathToReferencesMap) {
  const path = operationPath.at(-2).trim();

  // If a resource-specific path, it can't be a collection path.
  if (path.endsWith('}')) {
    return {};
  }

  return getSchemaInfo(path, apidef, pathToReferencesMap);
}

function getSchemaInfo(path, apidef, pathToReferencesMap) {
  const getOperation = apidef.paths[path].get;
  if (!getOperation) {
    logger.debug(`${ruleId}: no GET operation found on path "${path}"`);
    return {};
  }

  const schemaInfo = getSuccessResponseSchemaForOperation(
    getOperation,
    `paths.${path}.get`
  );
  if (schemaInfo.schemaPath) {
    schemaInfo.schemaName = getSchemaNameAtPath(
      schemaInfo.schemaPath,
      pathToReferencesMap
    );
  }

  return schemaInfo;
}

function isCollectionPath(path, apidef, pathToReferencesMap) {
  // Check if the GET response for the path is a "list".
  const { schemaPath, schemaName } = getCollectionSchema(
    path,
    apidef,
    pathToReferencesMap
  );
  logger.debug(
    `${ruleId}: found the name of the potential collection schema to be ${schemaName}`
  );

  if (!schemaPath || !schemaName) {
    return false;
  }

  // If the GET operation returns a "collection" schema, treat it as a collection
  // path and assume any PUT operations on the path are bulk operations.
  return schemaName.endsWith('Collection');
}
