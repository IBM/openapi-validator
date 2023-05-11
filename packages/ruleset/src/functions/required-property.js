/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemaHasProperty,
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
    checkRequiredProperties,
    true,
    false
  );
};

/**
 * Checks "schema" to make sure that any property names contained in "required" fields
 * are in fact properties that are defined by the schema.
 * The algorithm used to perform these checks will vary a bit depending on the type
 * of composition being used (if any):
 * - none (no allOf/anyOf/oneOf):
 *   - each property name in the "required" field should be a property that is
 *     explicitly defined by "schema".
 * - allOf:
 *   - avoid checking the individual allOf element schemas as these can be partial schemas
 *   - any property names contained in the "required" fields defined within
 *     the allOf elements or on the main schema should be defined on "schema" or
 *     within one or more of the allOf elements
 *  - anyOf/oneOf:
 *   - each anyOf/oneOf element schema should be checked on its own in isolation,
 *     which happens automatically
 *   - each schema with a oneOf/anyOf will have its main required list checked against
 *     the conjuction of its own properties and the element schemas, recursively
 *
 * @param {*} schema the schema to check
 * @param {*} path the jsonpath location of "schema"
 * @returns zero or more errors
 */
function checkRequiredProperties(schema, path) {
  logger.debug(
    `${ruleId}: checking for required properties in schema at location: ${path.join(
      '.'
    )}`
  );

  // If "schema" is an element of an allOf list, we'll bypass checking
  // that schema in isolation, since each allOf element schema can be a partial schema.
  // For a schema containing an allOf, we'll do all the checking for that schema
  // when we're called for the schema containing the allOf.
  if (path[path.length - 2] == 'allOf') {
    logger.debug(`${ruleId}: bypassing check for allOf list element schema.`);
    return [];
  }

  const errors = [];

  // If "schema" contains an allOf list, then check the "required" field
  // in each of the allOf elements.
  if (Array.isArray(schema.allOf)) {
    logger.debug(
      `${ruleId}: schema contains allOf; checking allOf list elements.`
    );

    // Check the "required" field in each of the allOf elements.
    for (let i = 0; i < schema.allOf.length; i++) {
      errors.push(
        ...checkRequired(
          schema,
          [...path, 'allOf', i.toString()],
          schema.allOf[i]
        )
      );
    }

    // Finally, check the "required" field in the main schema.
    errors.push(...checkRequired(schema, path));
  } else {
    // For a non-allOf schema, just check its properties vs its required field.
    // This handles both non-composed schemas and oneOf/anyOf schemas.
    errors.push(...checkRequired(schema, path));
  }

  return errors;
}

/**
 * Checks schema's "required" list for property names that are not
 * contained in "propNames".
 * @param {*} schema the schema whose "required" field is to be checked
 * @param {*} propNames the names of properties defined by "schema"
 * @param {*} path the jsonpath location of "schema"
 * @returns
 */
function checkRequired(schema, path, subschema) {
  // In the case of an allOf, we want to check the individual subschemas
  // required list against the whole schema
  const required = subschema ? subschema.required : schema.required;
  if (Array.isArray(required)) {
    const errors = [];
    const localPath = [...path, 'required'];
    logger.debug(`${ruleId}: checking ${localPath.join('.')}`);

    required.forEach(name => {
      logger.debug(`${ruleId}: looking for property ${name}`);
      if (!schemaHasProperty(schema, name)) {
        errors.push({
          message: `Required property must be defined in the schema: ${name}`,
          path: localPath,
        });
        logger.debug(`${ruleId}: Missing required property: ${name}`);
      }
    });

    return errors;
  }

  return [];
}
