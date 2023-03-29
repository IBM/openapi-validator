/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (param, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return parameterDefault(param, context.path);
};

const errorMsg = 'Required parameters should not define a default value';

function parameterDefault(param, path) {
  logger.debug(`${ruleId}: checking parameter at location: ${path.join('.')}`);

  if (param.required && paramHasDefault(param)) {
    logger.debug(`Parameter is required AND has a default value!`);
    return [
      {
        message: errorMsg,
        path,
      },
    ];
  }

  return [];
}

/**
 * Returns true if 'param' has a default value defined in it.
 * This needs to take into account the oas2 flavor of a parameter
 * where the default value would be defined directly on the param object,
 * and the oas3 flavor where it is defined inside the param's schema.
 */
function paramHasDefault(param) {
  return param.schema
    ? param.schema.default !== undefined
    : param.default !== undefined;
}
