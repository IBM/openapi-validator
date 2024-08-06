/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isStringSchema,
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
    anchoredPatterns,
    true,
    false
  );
};

/**
 * This function will check the "pattern" attribute found on each string schema
 * to ensure that it is "anchored" (i.e. it starts with ^ and ends with $).
 * @param {*} schema the schema to check
 * @param {*} path the array of path segments indicating the "location" of the pathItem within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function anchoredPatterns(schema, path) {
  const errors = [];

  logger.debug(`${ruleId}: checking schema at location: ${path.join('.')}`);

  // We're only interested in checking the pattern attributes within string schemas.
  // Note that the "ibm-string-attributes" rule will warn if it finds a pattern attribute
  // in a non-string schema.
  if (isStringSchema(schema)) {
    // Check "schema.pattern".
    errors.push(...checkPatternAttribute(schema.pattern, [...path, 'pattern']));

    // Now check for "pattern" within allOf/anyOf/oneOf lists (if present).
    for (const applicator of ['allOf', 'anyOf', 'oneOf']) {
      if (Array.isArray(schema[applicator])) {
        for (let i = 0; i < schema[applicator].length; i++) {
          errors.push(
            ...checkPatternAttribute(schema[applicator][i].pattern, [
              ...path,
              applicator,
              i.toString(),
              'pattern',
            ])
          );
        }
      }
    }
  }

  return errors;
}

/**
 * Checks the specified "pattern" attribute to make sure that it
 * contains a regular expression string that is "anchored" (i.e.
 * it starts with ^ and ends with $).
 * @param {*} pattern the pattern value to check (might be undefined)
 * @param {*} path the jsonpath location of the pattern value within the resolved API definition
 * @returns an array containing exactly one error object, or [] if no error was found
 */
function checkPatternAttribute(pattern, path) {
  if (isDefined(pattern)) {
    logger.debug(
      `${ruleId}: checking pattern value '${pattern}' at location: ${path.join(
        '.'
      )}`
    );
    if (!pattern.startsWith('^') || !pattern.endsWith('$')) {
      logger.debug(
        `${ruleId}: un-anchored pattern '${pattern}' found at location: ${path.join(
          '.'
        )}`
      );
      return [
        {
          message: `A regular expression used in a 'pattern' attribute should be anchored with ^ and $`,
          path,
        },
      ];
    }
  }

  return [];
}

function isDefined(x) {
  return x !== null && x !== undefined;
}
