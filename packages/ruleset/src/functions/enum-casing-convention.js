/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { validateSubschemas } = require('@ibm-cloud/openapi-ruleset-utilities');
const { casing } = require('@stoplight/spectral-functions');
const { LoggerFactory } = require('../utils');

let casingConfig;
let ruleId;
let logger;

module.exports = function (schema, options, context) {
  // Save this rule's "functionOptions" value since we need
  // to pass it on to Spectral's "casing" function.
  casingConfig = options;

  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return validateSubschemas(schema, context.path, checkEnumCaseConvention);
};

function checkEnumCaseConvention(schema, path) {
  // If 'schema' has an enum field with string values,
  // we'll check each enum value to make sure it complies
  // with the configured case convention.
  if (schema.enum) {
    logger.debug(`${ruleId}: checking enum at location: ${path.join('.')}`);
    const errors = [];
    for (let i = 0; i < schema.enum.length; i++) {
      const enumValue = schema.enum[i];
      if (typeof enumValue === 'string') {
        const result = casing(enumValue, casingConfig);

        // If casing() returns an error, then we'll augment the message and path
        // to reflect the offending enum value.
        // casing() will return either an array with 1 element or undefined.
        if (result) {
          logger.debug(
            `${ruleId}: enum value is non-compliant: '${enumValue}'`
          );
          result[0].message = 'Enum values ' + result[0].message;
          result[0].path = [...path, 'enum', i.toString()];
          errors.push(result[0]);
        }
      }
    }
    return errors;
  }

  return [];
}
