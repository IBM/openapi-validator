/*
 * validateNestedSchemas() performs validation on a schema and all of its nested schemas.
 *
 * Nested schemas include property schemas (for an object schema), items schemas (for an array
 * schema), plus all nested schemas of those schemas.
 *
 * Nested schemas included via `allOf`, `oneOf`, and `anyOf` are validated, but composed schemas
 * are not themselves validated. Nested schemas included via `not` are not validated.
 */
const validateNestedSchemas = (
  schema,
  path,
  validate,
  includeSelf = true,
  includeNot = false
) => {
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
