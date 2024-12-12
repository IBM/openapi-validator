/**
 * @file
 * @copyright IBM Corporation 2017–2024
 * @license Apache-2.0
 */

/**
 * @private
 */
const isObject = require('./is-object');

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
 * WARNING: It is only safe to use this function for a "resolved" schema — it cannot traverse `$ref`
 * references.
 * @param {object} schema simple or composite OpenAPI 3.x schema object
 * @param {Array} path path array for the provided schema
 * @param {Function} validate a `(schema, path) => errors` function to validate a simple schema
 * @param {boolean} includeSelf validate the provided schema in addition to its nested schemas (defaults to `true`)
 * @param {boolean} includeNot validate schemas composed with `not` (defaults to `false`)
 * @returns {Array} validation errors
 */
function validateNestedSchemas(
  schema,
  path,
  validate,
  includeSelf = true,
  includeNot = false
) {
  // Make sure 'schema' is an object.
  if (!isObject(schema)) {
    throw new Error(
      `the entity at location ${path.join('.')} must be a schema object`
    );
  }

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

  if (
    schema.patternProperties &&
    typeof schema.patternProperties === 'object'
  ) {
    for (const entry of Object.entries(schema.patternProperties)) {
      errors.push(
        ...validateNestedSchemas(
          entry[1],
          [...path, 'patternProperties', entry[0]],
          validate,
          true,
          includeNot
        )
      );
    }
  }

  return errors;
}

module.exports = validateNestedSchemas;
