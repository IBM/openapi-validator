/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  validateSubschemas,
  getPropertyNamesForSchema,
  isObject,
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
 *   - each anyOf/oneOf element schema should be checked on its own in isolation
 *   - for each anyOf/oneOf element schema, perform an additional check using the main schema's "required"
 *     field along along with the union of properties defined on "schema" plus the specific
 *     anyOf/oneOf element schema
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

    // For an allOf, we need to collect the names of all the properties defined
    // by "schema", both in the main schema and in the allOf element schemas.
    const allPropNames = getPropertyNamesForSchema(schema);
    logger.debug(`${ruleId}: schema defines these properties: ${allPropNames}`);

    // Check the "required" field in each of the allOf elements.
    for (let i = 0; i < schema.allOf.length; i++) {
      errors.push(
        ...checkRequired(schema.allOf[i], allPropNames, [
          ...path,
          'allOf',
          i.toString(),
        ])
      );
    }

    // Finally, check the "required" field in the main schema.
    errors.push(...checkRequired(schema, allPropNames, path));
  }

  // If "schema" contains an anyOf and/or oneOf list, then we need to
  // perform the checks for each list element schema in isolation,
  // plus check the main schema together with each individual
  // list element schema in turn.
  // It turns out that we don't need to perform the check on the list element
  // schemas in isolation here, because this rule will eventually be invoked
  // separately for those schemas.
  for (const fieldName of ['anyOf', 'oneOf']) {
    const list = schema[fieldName];
    if (Array.isArray(list)) {
      logger.debug(
        `${ruleId}: schema contains ${fieldName}; checking ${fieldName} list elements.`
      );
      const schemaPropNames = isObject(schema.properties)
        ? schema.properties.keys()
        : [];
      for (let i = 0; i < list.length; i++) {
        const subschemaPropNames = getPropertyNamesForSchema(list[i]);
        const combinedPropNames = [...schemaPropNames, ...subschemaPropNames];

        // Check schema.required vs the set of combined property names.
        errors.push(...checkRequired(schema, combinedPropNames, path));
      }
    }
  }

  // Finally, for a non-composed schema, just check its properties vs its required field.
  if (!schema.allOf && !schema.anyOf && !schema.oneOf) {
    const propNames = getPropertyNamesForSchema(schema);
    errors.push(...checkRequired(schema, propNames, path));
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
function checkRequired(schema, propNames, path) {
  const errors = [];

  if (Array.isArray(schema.required)) {
    const localPath = [...path, 'required'];
    logger.debug(`${ruleId}: checking ${localPath.join('.')}`);

    schema.required.forEach(function (name) {
      logger.debug(`${ruleId}: looking for property ${name}`);
      if (!propNames.includes(name)) {
        errors.push({
          message: `Required property must be defined in the schema: ${name}`,
          path: localPath,
        });
        logger.debug(`${ruleId}: Missing required property: ${name}`);
      }
    });
  }

  return errors;
}
