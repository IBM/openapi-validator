/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * @private
 */
const SchemaPath = require('./schema-path');
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
 * The provided `validate()` function is called with three arguments:
 * - `subschema`: the composed or nested schema
 * - `path`: the array of path segments to locate the subschema within the resolved document
 * - `logicalPath`: the array of path segments to locate an instance of `subschema` within an
 *    instance of `schema` (the schema for which `validateSubschemas()` was originally called.)
 *    Within the logical path, an arbitrary array item is represented by `[]` and an arbitrary
 *    dictionary property is represented by `*`.
 *
 * The provided `validate()` function is guaranteed to be called:
 * - for a schema before any of its composed schemas
 * - for a schema before any of its nested schemas
 * - more recently for the schema that composes it (its "composition parent") than for that schema's
 *    siblings (or their descendants) in the portion of composition tree local to the composition
 *    parent's branch of the nesting tree
 * - more recently for the schema that nests it (its "nesting parent") than for that schema's
 *    siblings (or their descendants) in the portion of nesting tree local to the nesting parent's
 *    branch of the composition tree
 *
 * However, it is not guaranteed that the `validate()` function is called in any particular order
 * for a schema's directly composed or directly nested schemas.
 *
 * WARNING: It is only safe to use this function for a "resolved" schema — it cannot traverse `$ref`
 * references.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {Array} path path array for the provided schema
 * @param {Function} validate a `(schema, path, logicalPath) => errors` function to validate a simple schema
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
    (s, p, lp) =>
      validateComposedSchemas(
        s,
        new SchemaPath(p, lp),
        validate,
        true,
        includeNot
      ),
    includeSelf,
    includeNot
  );
}

module.exports = validateSubschemas;
