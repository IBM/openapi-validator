/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isObject } = require('@ibm-cloud/openapi-ruleset-utilities');
const { pattern } = require('@stoplight/spectral-functions');
const { LoggerFactory } = require('../utils');

let patternConfig;
let ruleId;
let logger;

/**
 * The implementation for this rule makes assumptions that are dependent on the
 * presence of the following other rules:
 *
 * - ibm-avoid-inline-schemas: all relevant schemas are named (defined with references)
 */

module.exports = function (components, options, context) {
  // Save this rule's "functionOptions" value since we need
  // to pass it on to Spectral's "pattern" function.
  patternConfig = options;

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
    const result = pattern(schemaName, patternConfig);
    if (result) {
      logger.debug(
        `${ruleId}: failed pattern check: ${JSON.stringify(result)}`
      );
      errors.push({
        message: 'Schema names must be upper camel case',
        path: [...path, 'schemas', schemaName],
      });
    }
  });

  return errors;
}
