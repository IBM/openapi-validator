/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isObject,
  schemaHasConstraint,
} = require('@ibm-cloud/openapi-ruleset-utilities');

const {
  isJsonMimeType,
  isJsonPatchMimeType,
  isMergePatchMimeType,
  LoggerFactory,
  operationMethods,
} = require('../utils');

let ruleId;
let logger;

module.exports = function (pathItem, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return checkForNameCollisions(pathItem, context.path);
};

/**
 * This function checks each operation to see check for collisions between
 * the names of operation parameters and the names of top-level properties within
 * the operation's request body schema.
 *
 * @param {*} pathItem the path item that contains zero or more operations to be checked
 * @param {*} path the array of path segments indicating the "location" of the pathItem within the API definition
 * @returns an array containing the violations found, or [] if no violations
 */
function checkForNameCollisions(pathItem, path) {
  logger.debug(`${ruleId}: checking pathItem at location: ${path.join('.')}`);

  const errors = [];

  // Grab the parameters defined on the pathItem object.
  const pathItemParams = getParamNames(pathItem);

  // Visit each operation associated with this pathItem.
  for (const method of operationMethods) {
    const op = pathItem[method];
    if (op) {
      // Grab the parameter names defined for this operation.
      const operationParams = getParamNames(op);

      // Combine the path-level and operation-level parameter names.
      const params = [...pathItemParams, ...operationParams];

      logger.debug(
        `${ruleId}: ${method} operation (${
          op.operationId
        }) defines these parameters: ${params.join(', ')}`
      );

      // Grab the requestBody schema (the schema associated with the first
      // JSON-like mimetype that we find) and then check each parameter
      // name to see if there is a like-named schema property.
      const mimeTypes =
        op.requestBody && op.requestBody.content
          ? Object.keys(op.requestBody.content)
          : [];

      const jsonMimeType = mimeTypes.find(
        m =>
          isJsonMimeType(m) || isJsonPatchMimeType(m) || isMergePatchMimeType(m)
      );

      const jsonBodySchema = jsonMimeType
        ? op.requestBody.content[jsonMimeType].schema
        : null;

      // If the operation defines JSON requestBody content, then perform the checks.
      if (jsonBodySchema) {
        logger.debug(
          `${ruleId}: JSON requestBody content found, performing name checks.`
        );

        for (const paramName of params) {
          if (schemaHasWritableProperty(jsonBodySchema, paramName)) {
            logger.debug(
              `${ruleId}: Found requestBody property ${paramName}, collision detected!`
            );
            errors.push({
              message: `Name collision detected between operation parameter and requestBody property: ${paramName}`,
              path: [...path, method],
            });
          }
        }
      } else {
        logger.debug(`${ruleId}: No JSON requestBody content found.`);
      }
    }
  }

  logger.debug(
    `${ruleId}: Returning these errors: ${JSON.stringify(errors, null, 2)}`
  );

  return errors;
}

/**
 * Returns a list containing the names of parameters defined for "paramContainer".
 * @param paramContainer the pathItem or operation that potentially contains parameters
 * @returns the names of parameters defined in "paramContainer" or [] if no parameters are defined
 */
function getParamNames(paramContainer) {
  let paramNames = [];

  if (Array.isArray(paramContainer.parameters)) {
    paramNames = paramContainer.parameters.map(p => p.name);
  }

  return paramNames;
}

/**
 * Returns true iff 'schema' defines a property named 'name' that is NOT readOnly.
 * This function handles composed schemas as well.
 */
function schemaHasWritableProperty(schema, name) {
  return schemaHasConstraint(
    schema,
    s =>
      'properties' in s &&
      isObject(s.properties[name]) &&
      !s.properties[name].readOnly
  );
}
