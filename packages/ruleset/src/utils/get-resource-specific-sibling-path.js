/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isObject } = require('@ibm-cloud/openapi-ruleset-utilities');

/**
 * Given an operation on a generic resource path (e.g. /foo) to an operation,
 * look for a specific resource path that is a sibling (e.g. /foo/{id}); if
 * found, return the sibling path as a string.
 *
 * Note: the given path MUST be to an operation object.
 *
 * @param {*} path the array of path segments indicating the "location" of an operation within the API definition
 * @param {*} apidef the resolved API spec, as an object
 * @returns the specific resource path, as a string
 */
function getResourceSpecificSiblingPath(path, apidef) {
  // Paths are expected to be arrays, API def is expected to be an object
  if (!Array.isArray(path) || !isObject(apidef)) {
    return;
  }

  // If this path already ends with a path parameter, return 'undefined'.
  // This function should only find a path if it is a sibling of the current path.
  if (path[path.length - 2].toString().trim().endsWith('}')) {
    return;
  }

  const thisPath = path[path.length - 2].toString().trim();
  const siblingPathRE = new RegExp(`^${thisPath}/{[^{}/]+}$`);
  return Object.keys(apidef.paths).find(p => siblingPathRE.test(p));
}

module.exports = getResourceSpecificSiblingPath;
