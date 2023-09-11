/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isObject } = require('@ibm-cloud/openapi-ruleset-utilities');
const { casing } = require('@stoplight/spectral-functions');
const { LoggerFactory } = require('../utils');

let casingConfig;
let ruleId;
let logger;

module.exports = function (components, options, context) {
  // Save this rule's "functionOptions" value since we need
  // to pass it on to Spectral's "casing" function.
  casingConfig = options;

  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return schemaCaseConvention(components, context.path);
};

function schemaCaseConvention(components, path) {
  if (!components.schemas || !isObject(components.schemas)) {
    logger.debug(`${ruleId}: no schemas to validate, skipping rule`);
    return [];
  }

  const errors = [];

  Object.keys(components.schemas).forEach(schemaName => {
    const result = casing(schemaName, casingConfig);
    if (result) {
      logger.debug(`${ruleId}: failed casing check: ${JSON.stringify(result)}`);
      errors.push({
        message: `Schema names ${result[0].message.replace(
          'pascal',
          'upper camel'
        )}`,
        path: [...path, 'schemas', schemaName],
      });
    }
  });

  return errors;
}
