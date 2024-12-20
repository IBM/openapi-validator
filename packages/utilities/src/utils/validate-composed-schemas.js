/**
 * @file
 * @copyright IBM Corporation 2017–2024
 * @license Apache-2.0
 */

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
  path,
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

  if (includeSelf) {
    errors.push(...validate(schema, path));
  }

  if (includeNot && schema.not) {
    errors.push(
      ...validateComposedSchemas(schema.not, [...path, 'not'], validate)
    );
  }

  for (const applicatorType of ['allOf', 'oneOf', 'anyOf']) {
    if (Array.isArray(schema[applicatorType])) {
      schema[applicatorType].forEach((s, i) => {
        errors.push(
          ...validateComposedSchemas(s, [...path, applicatorType, i], validate)
        );
      });
    }
  }

  return errors;
}

module.exports = validateComposedSchemas;
