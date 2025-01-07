/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * @private
 */
const SchemaPath = require('./schema-path');

/**
 * Performs validation on a schema and all of its composed schemas.
 *
 * This function is useful when a certain syntactic practice is prescribed or proscribed within
 * every simple schema composed by a schema.
 *
 * For example, if a rule enforced that non-`false` `additionalProperties` and `patternProperties`
 * keywords were never to be used in a top-level request body object schema, this function could run
 * that validation on every composed schema independently.
 *
 * Composed schemas are those referenced by `allOf`, `anyOf`, `oneOf`, or `not`, plus all schemas
 * composed by those schemas.
 *
 * Composed schemas **do not** include nested schemas (`property`, `additionalProperties`,
 * `patternProperties`, and `items` schemas).
 *
 * The provided validate function is called with two arguments:
 * - `schema` — the composed schema
 * - `path` — the array of path segments to locate the composed schema within the resolved document
 *
 * The provided `validate()` function is guaranteed to be called:
 * - for a schema before any of its composed schemas
 * - more recently for the schema that composes it (its "composition parent") than for that schema's
 *    siblings (or their descendants) in the composition tree
 *
 * However, it is not guaranteed that the `validate()` function is called in any particular order
 * for a schema's directly composed schemas.
 *
 * WARNING: It is only safe to use this function for a "resolved" schema — it cannot traverse `$ref`
 * references.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {Array} path path array for the provided schema
 * @param {Function} validate a `(schema, path) => errors` function to validate a simple schema
 * @param {boolean} includeSelf validate the provided schema in addition to its composed schemas (defaults to `true`)
 * @param {boolean} includeNot validate schemas composed with `not` (defaults to `true`)
 * @returns {Array} validation errors
 */
function validateComposedSchemas(
  schema,
  p, // internally, we pass a SchemaPath to this, but the external contract is just an array
  validate,
  includeSelf = true,
  includeNot = true
) {
  // If "schema" is a $ref, that means it didn't get resolved
  // properly (perhaps due to a circular ref), so just ignore it.
  if (schema.$ref) {
    return [];
  }

  const errors = [];
  const path = p instanceof SchemaPath ? p : new SchemaPath(p);

  if (includeSelf) {
    // We intentionally do not use `path.logical` here because the documented external contract
    // for `validateComposedSchemas()` is that the validate function is called with two arguments.
    // Tracking the logical path is only useful when `validateComposedSchemas()` is embedded in
    // another utility that can pass it an instance of `SchemaPath` (which is not exported).
    errors.push(...validate(schema, [...path], p?.logical));
  }

  if (includeNot && schema.not) {
    errors.push(
      ...validateComposedSchemas(schema.not, path.withNot(), validate)
    );
  }

  for (const applicatorType of ['allOf', 'oneOf', 'anyOf']) {
    if (Array.isArray(schema[applicatorType])) {
      schema[applicatorType].forEach((s, i) => {
        errors.push(
          ...validateComposedSchemas(
            s,
            path.withApplicator(applicatorType, i),
            validate
          )
        );
      });
    }
  }

  return errors;
}

module.exports = validateComposedSchemas;
