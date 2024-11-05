/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isEnumerationSchema,
  isObject,
  validateNestedSchemas,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return validateNestedSchemas(schema, context.path, (s, p) => {
    return checkForOptionalEnumerations(s, p, []);
  });
};

/**
 * Checks "schema" for any optional enumeration properties (i.e. type string w/"enum" field present).
 * @param {*} schema the schema to check
 * @param {*} path the json path location of "schema"
 * @param {*} contextualRequired required properties in the containing schema (if applicable)
 * @returns
 */
function checkForOptionalEnumerations(schema, path, contextualRequired) {
  if (isObject(schema)) {
    logger.debug(`${ruleId}: examining schema at location: ${path.join('.')}`);

    // The set of required property names that we'll use for our required/optional
    // checks consists of "schema"'s required list plus the property names passed in via
    // "contextualRequired".
    const requiredProps = [];
    if (Array.isArray(schema.required)) {
      requiredProps.push(...schema.required);
    }
    requiredProps.push(...contextualRequired);

    logger.debug(
      `${ruleId}: required properties: ${JSON.stringify(requiredProps)}`
    );

    const errors = [];

    // 1. Check the properties defined directly in "schema".
    if (isObject(schema.properties)) {
      for (const [name, prop] of Object.entries(schema.properties)) {
        logger.debug(`${ruleId}: examining property '${name}')}`);

        if (isEnumerationSchema(prop) && !requiredProps.includes(name)) {
          logger.debug(`${ruleId}: property '${name}' failed validation!`);
          errors.push({
            message:
              'In a response body, an enumeration field MUST be required',
            path: [...path, 'properties', name],
          });
        }
      }
    }

    // 2. Recursively check each allOf/anyOf/oneOf list element schemas.
    for (const applicatorType of ['allOf', 'anyOf', 'oneOf']) {
      if (Array.isArray(schema[applicatorType])) {
        schema[applicatorType].forEach((s, i) => {
          errors.push(
            ...checkForOptionalEnumerations(
              s,
              [...path, applicatorType, i.toString()],
              requiredProps
            )
          );
        });
      }
    }

    return errors;
  }

  return [];
}
