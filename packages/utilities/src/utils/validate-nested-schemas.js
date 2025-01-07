/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * @private
 */
const isObject = require('./is-object');
/**
 * @private
 */
const SchemaPath = require('./schema-path');

/**
 * Performs validation on a schema and all of its nested schemas.
 *
 * This function is useful when a certain semantic quality is required for every composite schema
 * nested by a schema. The `validate` function passed to this function must itself be
 * "composition-aware." Usually this means it will use other utilities (such as `getSchemaType()` or
 * `schemaHasConstraint()`) to determine the semantic qualities of a composite schema.
 *
 * For example, if a rule enforced that all of an object schema's properties be required, this
 * function could be passed a validation function that itself used the composition-aware
 * `getPropertyNamesForSchema()` and `schemaRequiresProperty()`.
 *
 * Nested schemas include `property`, `additionalProperties`, and `patternProperties` schemas
 * (for an object schema), `items` schemas (for an array schema), plus all nested schemas of those
 * schemas.
 *
 * Nested schemas included via `allOf`, `oneOf`, and `anyOf` are validated, but composed schemas
 * are not themselves validated. By default, nested schemas included via `not` are not validated.
 *
 * The provided validate function is called with three arguments:
 * - `nestedSchema`: the nested schema
 * - `path`: the array of path segments to locate the nested schema within the resolved document
 * - `logicalPath`: the array of path segments to locate an instance of `nestedSchema` within an
 *    instance of `schema` (the schema for which `validateNestedSchemas()` was originally called.)
 *    Within the logical path, an arbitrary array item is represented by `[]` and an arbitrary
 *    dictionary property is represented by `*`.
 *
 * The provided `validate()` function is guaranteed to be called:
 * - for a schema before any of its nested schemas
 * - more recently for the schema that nests it (its "nesting parent") than for that schema's
 *    siblings (or their descendants) in the nesting tree
 *
 * However, it is not guaranteed that the `validate()` function is called in any particular order
 * for a schema's directly nested schemas.
 *
 * WARNING: It is only safe to use this function for a "resolved" schema — it cannot traverse `$ref`
 * references.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {Array} path path array for the provided schema
 * @param {Function} validate a `(schema, path, logicalPath) => errors` function to validate a simple schema
 * @param {boolean} includeSelf validate the provided schema in addition to its nested schemas (defaults to `true`)
 * @param {boolean} includeNot validate schemas composed with `not` (defaults to `false`)
 * @returns {Array} validation errors
 */
function validateNestedSchemas(
  schema,
  p, // internally, we pass a SchemaPath to this, but the external contract is just an array
  validate,
  includeSelf = true,
  includeNot = false
) {
  // Make sure 'schema' is an object.
  if (!isObject(schema)) {
    throw new Error(
      `the entity at location ${p.join('.')} must be a schema object`
    );
  }

  // If "schema" is a $ref, that means it didn't get resolved
  // properly (perhaps due to a circular ref), so just ignore it.
  if (schema.$ref) {
    return [];
  }

  const errors = [];
  const path = p instanceof SchemaPath ? p : new SchemaPath(p);

  if (includeSelf) {
    errors.push(...validate(schema, [...path], [...path.logical]));
  }

  if (schema.properties) {
    for (const property of Object.entries(schema.properties)) {
      errors.push(
        ...validateNestedSchemas(
          property[1],
          path.withProperty(property[0]),
          validate,
          true,
          includeNot
        )
      );
    }
  }

  if (schema.items) {
    errors.push(
      ...validateNestedSchemas(
        schema.items,
        path.withArrayItem(),
        validate,
        true,
        includeNot
      )
    );
  }

  if (
    schema.additionalProperties &&
    typeof schema.additionalProperties === 'object'
  ) {
    errors.push(
      ...validateNestedSchemas(
        schema.additionalProperties,
        path.withAdditionalProperty(),
        validate,
        true,
        includeNot
      )
    );
  }

  if (
    schema.patternProperties &&
    typeof schema.patternProperties === 'object'
  ) {
    for (const entry of Object.entries(schema.patternProperties)) {
      errors.push(
        ...validateNestedSchemas(
          entry[1],
          path.withPatternProperty(entry[0]),
          validate,
          true,
          includeNot
        )
      );
    }
  }

  if (includeNot && schema.not) {
    errors.push(
      ...validateNestedSchemas(
        schema.not,
        path.withNot(),
        validate,
        false,
        includeNot
      )
    );
  }

  for (const applicatorType of ['allOf', 'oneOf', 'anyOf']) {
    if (Array.isArray(schema[applicatorType])) {
      schema[applicatorType].forEach((s, i) => {
        errors.push(
          ...validateNestedSchemas(
            s,
            path.withApplicator(applicatorType, i),
            validate,
            false,
            includeNot
          )
        );
      });
    }
  }

  return errors;
}

module.exports = validateNestedSchemas;
