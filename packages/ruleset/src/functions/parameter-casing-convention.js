/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { casing, pattern } = require('@stoplight/spectral-functions');
const { isDeprecated, LoggerFactory } = require('../utils');

// Error message prefix for each parameter type.
const errorMsgPrefix = {
  query: 'Query parameter names ',
  path: 'Path parameter names ',
  header: 'Header parameter names ',
};

const errorMsgNoName = 'Parameters must have a name';
const errorMsgNoIn = "Parameters must have a valid 'in' value";

let ruleId;
let logger;

module.exports = function (param, options, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return parameterCasingConvention(param, context.path, options);
};

/**
 * This function will check 'param' to make sure that its name
 * follows the appropriate case convention, depending on its parameter type.
 * @param {*} param the parameter object to check
 * @param {*} path the location of 'param' within the OpenAPI document
 * @param {*} casingConfig this is the value of the 'functionOptions' field
 * within this rule's definition (see src/rules/parameter-case-convention.js).
 * This should be an object with an entry (key) for each parameter type (i.e. 'in' value).
 * The value of each entry should be an object which is the config to be
 * passed to Spectral's casing() function to enforce case conventions for that parameter type.
 * @returns an array containing zero or more error objects
 */
function parameterCasingConvention(param, path, casingConfig) {
  // Don't bother enforcing the rule on deprecated parameters.
  if (isDeprecated(param)) {
    return [];
  }

  const errors = [];

  logger.debug(`${ruleId}: checking parameter at location: ${path.join('.')}`);

  // First, let's make sure the 'name' and 'in' properties are present.
  let hasName = true;
  let hasIn = true;
  if (!isNonEmptyString(param.name)) {
    errors.push({
      message: errorMsgNoName,
      path,
    });
    hasName = false;
    logger.debug(`${ruleId}: param has no name!`);
  }
  if (!isNonEmptyString(param.in)) {
    errors.push({
      message: errorMsgNoIn,
      path,
    });
    hasIn = false;
    logger.debug(`${ruleId}: param has no in!`);
  }

  // If we have 'name' and 'in' properties, then check for the proper casing.
  if (hasName && hasIn) {
    const paramIn = param.in.toString().trim().toLowerCase();

    // Retrieve the config for the appropriate param type and then use it
    // to invoke the casing() or pattern() function.
    const config = casingConfig[paramIn];
    const msgPrefix = errorMsgPrefix[paramIn];
    if (config && msgPrefix) {
      logger.debug(
        `${ruleId}: checking case for ${paramIn} param '${param.name}'`
      );

      let result;
      // Check for casing()-style check first.
      if (config.type) {
        result = casing(param.name, config);
      }
      // Then, check for pattern()-style check.
      else if (config.match) {
        result = pattern(param.name, config);
      }

      // casing()/pattern() will return either an array with 1 element or undefined.
      // We'll prepend the returned error message with our prefix.
      if (result) {
        // Allow user override of the messages produced for the rule.
        const userMsg = casingConfig[paramIn + 'Message'];
        errors.push({
          message: userMsg ? userMsg : msgPrefix + result[0].message,
          path,
        });
        logger.debug(`${ruleId}: FAILED: ${JSON.stringify(result, null, 2)}`);
      } else {
        logger.debug(`${ruleId}: PASSED!`);
      }
    }
  }

  return errors;
}

function isNonEmptyString(s) {
  return s && s.toString().trim().length;
}
