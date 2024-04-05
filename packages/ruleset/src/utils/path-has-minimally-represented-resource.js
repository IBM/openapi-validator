/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const getResponseCodes = require('./get-response-codes');

/**
 * This function checks for a "minimally represented resource" (i.e. a resource
 * with no body representation) path. The path is considered to have a minimally
 * represented resource if the GET request on the path returns a 204 response.
 *
 * @param {string} path - the resource-specific path to check
 * @param {*} apidef - resolved api spec
 * @param {*} logger - logger object passed from rule, to maintain scope
 * @param {string} ruleId - name of current rule, to maintain scope
 * @returns {bool} true if the resource on this path is minimally represented
 */
function pathHasMinimallyRepresentedResource(path, apidef, logger, ruleId) {
  // This should only be true when the path is resource-specific
  // (i.e. ends with a path parameter).
  if (!path.endsWith('}')) {
    logger.debug(`${ruleId}: path "${path}" is not for a specific resource`);
    return false;
  }

  const pathItem = apidef.paths[path];
  if (!pathItem) {
    logger.debug(`${ruleId}: path "${path}" does not exist`);
    return false;
  }

  const resourceGetOperation = pathItem.get;
  if (!resourceGetOperation) {
    logger.debug(`${ruleId}: no GET operation found at path "${path}"`);
    return false;
  }

  if (!resourceGetOperation.responses) {
    logger.debug(
      `${ruleId}: no responses defined on GET operation at path "${path}"`
    );
    return false;
  }

  const [, getOpSuccessCodes] = getResponseCodes(
    resourceGetOperation.responses
  );

  logger.debug(
    `${ruleId}: corresponding GET operation has the following status codes: ${getOpSuccessCodes.join(
      ', '
    )}`
  );

  return getOpSuccessCodes.includes('204');
}

module.exports = pathHasMinimallyRepresentedResource;
