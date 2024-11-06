/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isObject } = require('@ibm-cloud/openapi-ruleset-utilities');

/**
 * This function checks for a "minimally represented resource" (i.e. a resource
 * with no body representation) path. The path is considered to have a minimally
 * represented resource if the GET request on the path returns a 204 response.
 *
 * @param {string} path - the resource-specific path to check
 * @param {*} apidef - resolved api spec
 * @returns {bool} true if the resource on this path is minimally represented
 */
function pathHasMinimallyRepresentedResource(path, apidef) {
  // Perform input validation. A string and a paths-containing
  // API definition object are expected.
  if (typeof path !== 'string') {
    return false;
  }

  if (!isObject(apidef) || !isObject(apidef.paths)) {
    return false;
  }

  const pathObj = apidef.paths[path];
  if (
    isObject(pathObj) &&
    isObject(pathObj.get) &&
    isObject(pathObj.get.responses)
  ) {
    if ('204' in pathObj.get.responses) {
      return true;
    }
  }
  return false;
}

module.exports = pathHasMinimallyRepresentedResource;
