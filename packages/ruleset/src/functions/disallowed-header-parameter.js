/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { LoggerFactory } = require('../utils');

/**
 * This custom rule function is used to check for disallowed header parameters,
 * such as Authorization, Accept, or Content-Type.
 * When configuring a rule to use this function, the 'then.functionOptions'
 * rule property must be an object containing the 'headerName' property, like this:
 * { headerName: 'Authorization' }
 *
 * The function will flag 'param' if it is a header parameter named '<headerParam>'.
 * @param {*} param a parameter object from the API definition
 * @param {*} path the path location (array of path segments) of the
 * parameter object within the API definition
 * @param {*} headerName the name of the header parameter to check for
 * @returns an array of size one if 'param' is flagged, or an empty array otherwise
 */
module.exports = function (param, options, context) {
  const ruleId = context.rule.name;
  const logger = LoggerFactory.getInstance().getLogger(ruleId);

  if (!options || !options.headerName || !options.headerName.trim().length) {
    throw new Error(
      "Required rule configuration property 'headerName' not found."
    );
  }
  return checkHeaderParam(
    logger,
    ruleId,
    param,
    context.path,
    options.headerName.trim().toLowerCase()
  );
};

// Return an error if 'param' is a header parameter named '<headerName>'.

function checkHeaderParam(logger, ruleId, param, path, headerName) {
  // Don't bother enforcing the rule on parameter references.
  if (!param.$ref) {
    logger.debug(
      `${ruleId}: checking parameter at location: ${path.join('.')}`
    );
    const isHeader = param.in && param.in.toLowerCase() === 'header';
    const isDisallowedHeader =
      param.name && param.name.trim().toLowerCase() === headerName;
    if (isHeader && isDisallowedHeader) {
      logger.debug(`${ruleId}: found disallowed header: ${headerName}`);
      return [
        {
          // This is a default message. We expect the rule definition to supply a message.
          message: `Header parameter should not be explicitly defined: ${headerName}`,
          path,
        },
      ];
    }
  }

  return [];
}
