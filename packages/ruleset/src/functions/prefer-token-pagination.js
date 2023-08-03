/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  getPaginatedOperationFromPath,
  getOffsetParamIndex,
  LoggerFactory,
} = require('../utils');

let ruleId;
let logger;

module.exports = function (pathObj, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return checkTypeOfPagination(pathObj, context.path);
};

/**
 * This function implements the prefer-token-pagination rule which checks
 * a paginated list operation to see if it implements offset/limit style
 * pagination, as we encourage the use of token-style pagination.
 *
 * An operation is considered to be a paginated "list"-type operation if:
 * 1. The path doesn't end in a path param reference (e.g. /v1/drinks vs /v1/drinks/{drink_id})
 * 2. The operation is a "get"
 * 3. The operation's response schema is an object containing an array property.
 * 4. The operation defines either an "offset" query param or a page token-type query param
 *    whose name is in ['start', 'token', 'cursor', 'page', 'page_token'].
 *
 * @param {*} pathItem the path item that potentially contains a paginated "get" operation.
 * @param {*} path the array of path segments indicating the "location" of the pathItem within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function checkTypeOfPagination(pathItem, path) {
  logger.debug(`${ruleId}: checking pathItem at location: ${path.join('.')}`);
  const operation = getPaginatedOperationFromPath(pathItem, path, {
    logger,
    ruleId,
  });

  // If `operation` is null, this is not a paginated operation.
  if (!operation) {
    logger.debug(
      `${ruleId}: no paginated operation found at path '${path.join('.')}'`
    );
    return [];
  }

  logger.debug(
    `${ruleId}: checking paginated operation at path ${path.join('.')}.get`
  );

  // Note: any operation returned from `getPaginatedOperationFromPath`
  // guarantees that the operation has defined parameters.
  const params = operation.parameters;
  logger.debug(
    `${ruleId}: list of params: ${params.map(p => p.name).join(',')}`
  );

  // Assume the presence of a parameter called `offset` indicates offset/limit pagination.
  const offsetParamIndex = getOffsetParamIndex(params);
  logger.debug(
    `${ruleId}: index of searched for 'offset' param: ${offsetParamIndex}`
  );
  if (offsetParamIndex >= 0) {
    logger.debug(
      `${ruleId}: 'offset' query param found at index ${offsetParamIndex}`
    );
    return [
      {
        message:
          'Token-based pagination is recommended over offset/limit pagination',
        path: [...path, 'get'],
      },
    ];
  }

  return [];
}
