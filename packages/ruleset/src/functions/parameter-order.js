/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (operation, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return parameterOrder(operation, context.path);
};

function parameterOrder(op, path) {
  if (op.parameters && op.parameters.length > 0) {
    logger.debug(
      `${ruleId}: checking parameter order for operation at location: ${path.join(
        '.'
      )}`
    );

    const errors = [];

    // Walk the list of parameters and report on any required params
    // that are listed after the first optional param.
    let haveOptional = false;
    for (let index = 0; index < op.parameters.length; index++) {
      const param = op.parameters[index];

      if (param.required === true) {
        if (haveOptional) {
          logger.debug(
            `${ruleId}: found required param AFTER an optional param!`
          );
          errors.push({
            message:
              'Required parameters should appear before optional parameters',
            path: [...path, 'parameters', index.toString()],
          });
        }
      } else {
        haveOptional = true;
      }
    }

    return errors;
  }

  return [];
}
