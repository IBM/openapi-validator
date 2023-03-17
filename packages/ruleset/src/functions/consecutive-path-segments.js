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
  return consecutivePathSegments(context.path);
};

/**
 * This function detects the presence of two or more consecutive path segments
 * containing path parameter references (e.g. '/v1/clouds/{cloud_id}/{region_id}').
 * @param {*} path the array of path segments indicating the "location" of a
 * pathItem within the API definition (e.g. ['paths','/v1/clouds/{id}'])
 * @returns an array containing the violations found or [] if no violations
 */
function consecutivePathSegments(path) {
  logger.debug(`${ruleId}: checking path item at location: ${path.join('.')}`);

  // The path string itself (e.g. '/v1/clouds/{id}') will be the last element in 'path'.
  const pathStr = path[path.length - 1].toString();

  // Check to see if the path string has two or more consecutive path segments
  // containing a path parameter reference (e.g. '/v1/clouds/{cloud_id}/{region_id}').
  if (/{[^/]+}\/{[^/]+}/.test(pathStr)) {
    logger.debug(`${ruleId}: found consecutive path param references!`);
    return [
      {
        message: `Path contains two or more consecutive path parameter references: ${pathStr}`,
        path,
      },
    ];
  }

  return [];
}
