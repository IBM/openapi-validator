/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * @private
 */
const validateComposedSchemas = require('./validate-composed-schemas');
/**
 * @private
 */
const validateNestedSchemas = require('./validate-nested-schemas');

/**
 * Performs validation on a schema and all of its subschemas.
 *
 * This function is useful when a certain syntactic practice is prescribed or proscribed within
 * every simple schema composed and/or nested by a schema.
 *
 * For example, if a rule enforced that the `format` keyword must only appear directly alongside the
 * `type` keyword (rather than being indirectly composed together with a `type`), this function
 * could run that validation on every simple schema independently.
 *
 * Subschemas include property schemas, 'additionalProperties', and 'patternProperties' schemas
 * (for an object schema), 'items' schemas (for an array schema), and applicator schemas
 * (such as those in an 'allOf', 'anyOf' or 'oneOf' property), plus all subschemas
 * of those schemas.
 *
 * WARNING: It is only safe to use this function for a "resolved" schema — it cannot traverse `$ref`
 * references.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {Array} path path array for the provided schema
 * @param {Function} validate a `(schema, path) => errors` function to validate a simple schema
 * @param {boolean} includeSelf validate the provided schema in addition to its subschemas (defaults to `true`)
 * @param {boolean} includeNot validate schemas composed with `not` (defaults to `true`)
 * @returns {Array} validation errors
 */
function validateSubschemas(
  schema,
  path,
  validate,
  includeSelf = true,
  includeNot = true
) {
  return validateNestedSchemas(
    schema,
    path,
    (s, p) => validateComposedSchemas(s, p, validate, true, includeNot),
    includeSelf,
    includeNot
  );
}

module.exports = validateSubschemas;
