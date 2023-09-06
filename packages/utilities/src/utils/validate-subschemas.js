/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const validateComposedSchemas = require('./validate-composed-schemas');
const validateNestedSchemas = require('./validate-nested-schemas');

/*
 * Performs validation on a schema and all of its subschemas.
 *
 * Subschemas include property schemas, 'additionalProperties', and 'patternProperties' schemas
 * (for an object schema), 'items' schemas (for an array schema), and applicator schemas
 * (such as those in an 'allOf', 'anyOf' or 'oneOf' property), plus all subschemas
 * of those schemas.
 *
 * Note: it is only safe to use this method within functions operating on the "resolved" specification,
 * which should always be the case.
 *
 * @param {object} schema - Simple or composite OpenAPI 3.0 schema object.
 * @param {array} path - Path array for the provided schema.
 * @param {function} validate - Validate function.
 * @param {boolean} includeSelf - Whether to validate the provided schema (or just its composed schemas).
 * @param {boolean} includeNot - Whether to validate schemas composed with `not`.
 * @returns {array} - Array of validation errors.
 */
const validateSubschemas = (
  schema,
  path,
  validate,
  includeSelf = true,
  includeNot = true
) => {
  return validateNestedSchemas(
    schema,
    path,
    (s, p) => validateComposedSchemas(s, p, validate, true, includeNot),
    includeSelf,
    includeNot
  );
};

module.exports = validateSubschemas;
