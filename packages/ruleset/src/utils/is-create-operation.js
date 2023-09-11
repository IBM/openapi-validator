/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isObject } = require('@ibm-cloud/openapi-ruleset-utilities');
const isOperationOfType = require('./is-operation-of-type');
const getResourceSpecificSiblingPath = require('./get-resource-specific-sibling-path');

/**
 * Returns `true` if the operation represents a "create" operation.
 *
 * An operation is considered to be a "create" operation if the operationId starts with "create"
 *    OR it's a POST request and there is a similar path but with a trailing path parameter reference.
 *
 * Note: the given path MUST be to an operation object.
 */
function isCreateOperation(operation, path, apidef) {
  // Paths are expected to be arrays, API def and operation are expected to be objects
  if (!Array.isArray(path) || !isObject(operation) || !isObject(apidef)) {
    return false;
  }

  // 1. If operationId starts with "create", we'll assume it's a create operation.
  if (
    operation.operationId &&
    operation.operationId.toString().trim().toLowerCase().startsWith('create')
  ) {
    return true;
  }

  // 2. If not a POST, then it's not a create operation.
  if (!isOperationOfType('post', path)) {
    return false;
  }

  // 3. Does this operation's path have a sibling path with a trailing path param reference?
  const siblingPath = getResourceSpecificSiblingPath(path.at(-2), apidef);
  return !!siblingPath;
}

module.exports = isCreateOperation;
