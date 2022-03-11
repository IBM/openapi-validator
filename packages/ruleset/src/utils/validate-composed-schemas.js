/*
 * validateComposedSchemas() performs validation on a schema and all of its composed schemas.
 *
 * Composed schemas are those referenced by allOf, anyOf, oneOf, or not, plus all schemas composed
 * by those schemas.
 *
 * Composed schemas DO NOT include nested schemas (property schemas, items schemas).
 */
const validateComposedSchemas = (
  schema,
  path,
  validate,
  includeSelf = true,
  includeNot = true
) => {
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
};

module.exports = validateComposedSchemas;
