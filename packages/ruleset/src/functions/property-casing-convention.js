/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { casing } = require('@stoplight/spectral-functions');
const { validateSubschemas } = require('@ibm-cloud/openapi-ruleset-utilities');
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

  return validateSubschemas(
    schema,
    context.path,
    checkPropertyCasingConvention
  );
};

function checkPropertyCasingConvention(schema, path) {
  if (schema.properties) {
    logger.debug(
      `${ruleId}: checking schema properties at location: ${path.join('.')}`
    );
    const errors = [];
    for (const propName of Object.keys(schema.properties)) {
      // skip deprecated properties
      if (schema.properties[propName].deprecated === true) {
        logger.debug(`${ruleId}: property '${propName}' is deprecated.`);
        continue;
      }

      const result = casing(propName, casingConfig);
      // 'casing' will only return 'undefined' or an array of length 1
      if (result) {
        logger.debug(`${ruleId}: failed casing check: ${propName}`);
        // 'casing' only reports the message - add the path to it
        // the message itself isn't great either - add some detail to it
        result[0].message =
          'Property names ' + result[0].message + ': ' + propName;
        result[0].path = [...path, 'properties'];
        errors.push(result[0]);
      }
    }

    return errors;
  }

  return [];
}
