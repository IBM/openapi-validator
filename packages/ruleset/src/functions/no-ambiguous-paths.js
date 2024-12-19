/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isObject } = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (paths, _options, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return checkAmbiguousPaths(paths);
};

/**
 * This function will check for "ambiguous" paths within the API definition.
 * In this context, two paths are "ambiguous" if they have the same number of path segments
 * and they differ only due to the presence of a path parameter reference within a
 * path segment.
 * For example, each of the following pairs of path strings would be considered
 * "ambiguous":
 * 1. "/v1/clouds/{id}", "/v1/clouds/{cloud_id}"
 * 2. "/v1/clouds/foo", "/v1/clouds/{cloud_id}"
 * 3. "/v1/{resource_type}/foo", "/v1/users/{user_id}"
 * @param {*} paths map containing all path objects
 * @returns an array containing zero or more error objects
 */
function checkAmbiguousPaths(paths) {
  logger.debug(`${ruleId}: checking for ambiguous paths...`);

  // Bail out immediately if 'paths' is not an object or has <= 1 key.
  if (!isObject(paths) || Object.keys(paths).length <= 1) {
    logger.debug(`${ruleId}: No paths to check!`);
    return [];
  }

  // Collect all the path strings, canonicalize them, then compare each pair
  // of path strings to determine if any are ambiguous.
  const rawPaths = Object.keys(paths);
  const canonicalizedPaths = getCanonicalizedPaths(rawPaths);

  // Walk through the array and compare each element with the rest of the array.
  const errors = [];
  for (let i = 0; i < canonicalizedPaths.length - 1; i++) {
    logger.debug(
      `${ruleId}: visiting canonicalizedPaths[${i.toString()}]: ${JSON.stringify(
        canonicalizedPaths[i]
      )}`
    );
    for (let j = i + 1; j < canonicalizedPaths.length; j++) {
      if (pathsAreAmbiguous(canonicalizedPaths[i], canonicalizedPaths[j])) {
        logger.debug(
          `${ruleId}: Found ambiguous paths: ${rawPaths[i]}, ${rawPaths[j]}`
        );
        errors.push({
          message: `Paths are ambiguous: '${rawPaths[i]}', '${rawPaths[j]}'`,
          path: ['paths', rawPaths[i]],
        });
      }
    }
  }

  if (!errors.length) {
    logger.debug(`${ruleId}: PASSED!`);
  }

  return errors;
}

/**
 * Canonicalize the set of path strings to make it easier to compare
 * them for ambiguity.  We'll do this by converting each path string into
 * an array of path segments, and also convert each path param reference to null.
 * @param {*} pathStrings the array of path strings from the API definition
 * @returns an array containing the canonicalized paths, with each element
 * being an array of path segments
 */
function getCanonicalizedPaths(pathStrings) {
  const paths = [];

  for (let p of pathStrings) {
    // Convert each path string into an array of path segments.
    if (p.startsWith('/')) {
      p = p.slice(1);
    }
    const pathSegs = p.split('/');

    // Convert any path parameter references to null.
    for (let i = 0; i < pathSegs.length; i++) {
      if (pathSegs[i].trim().match(/^{.*}$/)) {
        pathSegs[i] = null;
      }
    }

    paths.push(pathSegs);
  }

  return paths;
}

/**
 * Check two paths to see if they are "ambiguous".
 * @param {*} path1 array of path segments for first path to check
 * @param {*} path2 array of path segments for second path to check
 * @returns true if the two paths are ambiguous, false otherwise
 */
function pathsAreAmbiguous(path1, path2) {
  if (path1.length !== path2.length) {
    // The paths can't be ambiguous if they have a different # of path segments.
    return false;
  }

  // Compare the respective elements within path1 and path2
  // to see if the path segments are ambiguous.
  // We'll walk through the path segments of path1 and path2, and if we find
  // a respective pair of path segments that are both truthy (which means
  // they did NOT contain path param references) and are NOT the same string,
  // we know that the two paths are not ambiguous.
  // If we make it through all of the path segments and do not find any such
  // "differences", then the two paths are "ambiguous".
  for (let i = 0; i < path1.length; i++) {
    // If both paths have a non-param path segment at element 'i'
    // AND those path segments are not the same string, then this pair of
    // paths cannot be ambiguous.
    if (path1[i] && path2[i] && path1[i] !== path2[i]) {
      return false;
    }

    // Otherwise, we're looking at one of these scenarios:
    // 1. path1[i] is truthy, path2[i] is falsy -> ambiguous
    // 2. path1[i] is falsy, path2[i] is truthy -> ambiguous
    // 3. path1[i] is falsy, path2[i] is falsy -> ambiguous
  }

  return true;
}
