/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (pathItem, options, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return validatePathSegments(context.path);
};

/**
 * This function validates individual path segments within a path string.
 * Specifically, we'll check to make sure that a path segment that contains
 * a parameter reference (or at least appears to) actually contains only that
 * parameter reference and nothing more.
 * @param {*} path the array of path segments indicating the "location" of a
 * pathItem within the API definition (e.g. ['paths','/v1/clouds/{id}'])
 * @returns an array containing the violations found or [] if no violations
 */
function validatePathSegments(path) {
  logger.debug(
    `${ruleId}: checking path segments at location: ${path.join('.')}`
  );

  // The path string itself (e.g. '/v1/clouds/{id}') will be the last element in 'path'.
  const pathStr = path[path.length - 1].toString();

  // Parse the path string into the individual path segments.
  const segments = pathStr.split('/');
  logger.debug(`${ruleId}: found these path segments: ${segments}`);

  // Validate each path segment.
  const errors = [];
  for (const segment of segments) {
    // If it looks like the user intended to define a path param reference
    // (i.e. if we find either '{' or '}' within the path segment),
    // then check to make sure the segment only contains a single
    // path param reference.
    if (segment.indexOf('{') >= 0 || segment.indexOf('}') >= 0) {
      if (!/^{[^}]*}$/.test(segment)) {
        logger.debug(`${ruleId}: path segment failed check: '${segment}'`);
        errors.push({
          message: `Invalid path parameter reference within path segment: ${segment}`,
          path,
        });
      }
    }
  }

  return errors;
}
