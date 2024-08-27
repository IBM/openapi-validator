/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isObject,
  validateSubschemas,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return validateSubschemas(
    schema,
    context.path,
    patternPropertiesCheck,
    true,
    false
  );
};

/**
 * Enforces certain restrictions on the use of "patternProperties" within a schema:
 * 1. patternProperties and additionalProperties are mutually exclusive
 * 2. patternProperties must be an object
 * 3. patternProperties must not be empty
 * 4. patternProperties must have at most one entry
 * 5. patternProperties must anchor its pattern
 *
 * @param {*} schema the schema to check
 * @param {*} path the array of path segments indicating the location of "schema" within the API definition
 * @returns an array of zero or more errors
 */
function patternPropertiesCheck(schema, path) {
  logger.debug(
    `${ruleId}: checking 'patternProperties' in schema at location: ${path.join(
      '.'
    )}`
  );

  // We're only interested in this schema if it defines "patternProperties".
  if (!('patternProperties' in schema)) {
    return [];
  }

  if ('additionalProperties' in schema) {
    logger.debug(
      `${ruleId}: Error: found patternProperties and additionalProperties`
    );
    return [
      {
        message:
          'patternProperties and additionalProperties are mutually exclusive',
        path,
      },
    ];
  }

  if (!isObject(schema.patternProperties)) {
    logger.debug(`${ruleId}: Error: patternProperties is not an object!`);
    return [
      {
        message: 'patternProperties must be an object',
        path: [...path, 'patternProperties'],
      },
    ];
  }

  const keys = Object.keys(schema.patternProperties);
  if (!keys.length) {
    logger.debug(`${ruleId}: Error: patternProperties is empty!`);
    return [
      {
        message: 'patternProperties must be a non-empty object',
        path: [...path, 'patternProperties'],
      },
    ];
  }

  if (keys.length > 1) {
    logger.debug(
      `${ruleId}: Error: patternProperties has more than one entry!`
    );
    return [
      {
        message: 'patternProperties must be an object with at most one entry',
        path: [...path, 'patternProperties'],
      },
    ];
  }

  // At this point, we're guaranteed to have one pattern in the list.
  // We need to make sure the regular expression is anchored.
  if (!keys[0].startsWith('^') || !keys[0].endsWith('$')) {
    logger.debug(
      `${ruleId}: Error: patternProperties has a non-anchored pattern!`
    );
    return [
      {
        message: 'patternProperties patterns should be anchored with ^ and $',
        path: [...path, 'patternProperties', 0],
      },
    ];
  }

  logger.debug(`${ruleId}: PASSED!`);

  return [];
}
