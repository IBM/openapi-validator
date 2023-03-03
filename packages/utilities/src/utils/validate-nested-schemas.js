/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/*
 * Performs validation on a schema and all of its nested schemas.
 *
 * Nested schemas include property schemas (for an object schema), items schemas (for an array
 * schema), plus all nested schemas of those schemas.
 *
 * Nested schemas included via `allOf`, `oneOf`, and `anyOf` are validated, but composed schemas
 * are not themselves validated. Nested schemas included via `not` are not validated.
 *
 * Note: it is only safe to use this method within functions operating on the "resolved" specification,
 * which should always be the case.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @param {array} path - Path array for the provided schema.
 * @param {function} validate - Validate function.
 * @param {boolean} includeSelf - Whether to validate the provided schema (or just its nested schemas).
 * @param {boolean} includeNot - Whether to validate schemas composed with `not`.
 * @returns {array} - Array of validation errors.
 */
const validateNestedSchemas = (
  schema,
  path,
  validate,
  includeSelf = true,
  includeNot = false
) => {
  // If "schema" is a $ref, that means it didn't get resolved
  // properly (perhaps due to a circular ref), so just ignore it.
  if (schema.$ref) {
    return [];
  }

  const errors = [];

  if (includeSelf) {
    errors.push(...validate(schema, path));
  }

  if (schema.properties) {
    for (const property of Object.entries(schema.properties)) {
      errors.push(
        ...validateNestedSchemas(
          property[1],
          [...path, 'properties', property[0]],
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
        [...path, 'items'],
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
        [...path, 'additionalProperties'],
        validate,
        true,
        includeNot
      )
    );
  }

  if (includeNot && schema.not) {
    errors.push(
      ...validateNestedSchemas(
        schema.not,
        [...path, 'not'],
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
            [...path, applicatorType, i],
            validate,
            false,
            includeNot
          )
        );
      });
    }
  }

  return errors;
};

module.exports = validateNestedSchemas;
