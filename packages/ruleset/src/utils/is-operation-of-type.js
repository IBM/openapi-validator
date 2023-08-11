/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * Checks a path to a given operation to determine if it is an
 * operation of a given type (e.g. 'post', 'patch', etc.)
 *
 * Note: the given path MUST be to an operation object.
 *
 * @param {*} type an operation method type,  like 'get' or 'put'
 * @param {*} path the array of path segments indicating the "location" of the operation within the API definition
 * @returns a boolean value indicating if the operation is of the given type, based on the path
 */
function isOperationOfType(type, path) {
  if (typeof type !== 'string' || !Array.isArray(path)) {
    return false;
  }

  return type === path[path.length - 1].toString().trim().toLowerCase();
}

module.exports = isOperationOfType;
