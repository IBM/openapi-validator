/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isObject } = require('@ibm-cloud/openapi-ruleset-utilities');

/**
 * Given a "generic" resource path string (e.g. '/foo'), look for a
 * "specific" resource path that is a sibling (e.g. /foo/{id}); if
 * found, return the sibling path string.
 *
 * @param {*} path the path string (for a generic path e.g. '/foo')
 * @param {*} apidef the resolved API spec, as an object
 * @returns the specific resource path, as a string
 */
function getResourceSpecificSiblingPath(path, apidef) {
  // Paths are expected to be arrays, API def is expected to be an object
  if (typeof path !== 'string' || !isObject(apidef)) {
    return;
  }

  // If this path already ends with a path parameter, return 'undefined'.
  // This function should only find a path if it is a sibling of the current path.
  if (path.trim().endsWith('}')) {
    return;
  }

  const siblingPathRE = new RegExp(`^${path}/{[^{}/]+}$`);
  return Object.keys(apidef.paths).find(p => siblingPathRE.test(p));
}

module.exports = getResourceSpecificSiblingPath;
