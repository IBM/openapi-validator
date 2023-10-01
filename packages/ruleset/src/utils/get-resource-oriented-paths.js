/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isObject } = require('@ibm-cloud/openapi-ruleset-utilities');
const getResourceSpecificSiblingPath = require('./get-resource-specific-sibling-path');

/**
 * Cycles through the path strings within an API definition to collect the paths
 * that are "resource oriented" - that is, they contain the set operations that
 * perform action on a given resource. Paths are determined to be resource
 * oriented if they have a sibling path that is identical aside from its
 * specificity (meaning one ends in a path parameter and the other does not end
 * in a path parameter).
 *
 * This function collects all resource oriented paths into key/value pairs,
 * mapping them from resource-generic (e.g. /v1/foo) to resource-specific
 * (e.g. /v1/foo/{id}).
 *
 * @param {*} apidef the resolved API spec, as an object
 * @returns {object} a map of generic to specific resource oriented paths
 */
function getResourceOrientedPaths(apidef) {
  if (!isObject(apidef) || !isObject(apidef.paths)) {
    return {};
  }

  const paths = Object.keys(apidef.paths);
  const pathStore = {};
  paths.forEach(p => {
    // Skip paths that have already been discovered
    if (pathStore[p]) {
      return;
    }

    // This can only receive a value for resource generic paths
    const sibling = getResourceSpecificSiblingPath(p, apidef);
    if (sibling) {
      pathStore[p] = sibling;
    }
  });

  return pathStore;
}

module.exports = getResourceOrientedPaths;
