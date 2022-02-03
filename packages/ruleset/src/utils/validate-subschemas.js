// Subschemas include property schemas (for an object schema), item schemas
// (for an array schema), and applicator schemas (such as those in an allOf,
// anyOf, or oneOf property), plus all subschemas of those schemas.

const validateSubschemas = (schema, path, validate) => {
  const errors = [];
  // invoke validation function
  errors.push(...validate(schema, path));

  // recursively process subschemas
  if (schema.properties) {
    for (const property of Object.entries(schema.properties)) {
      errors.push(
        ...validateSubschemas(
          property[1],
          [...path, 'properties', property[0]],
          validate
        )
      );
    }
  }

  if (schema.items) {
    errors.push(
      ...validateSubschemas(schema.items, [...path, 'items'], validate)
    );
  }

  if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
    errors.push(
      ...validateSubschemas(
        schema.additionalProperties,
        [...path, 'additionalProperties'],
        validate
      )
    );
  }

  // partial to reduce code duplication between applicator schemas
  function processComposedSchemas(schemas, whichType) {
    if (Array.isArray(schemas)) {
      schemas.forEach((s, i) => {
        errors.push(
          ...validateSubschemas(s, [...path, whichType, i], validate)
        );
      });
    }
  }

  if (schema.allOf) {
    processComposedSchemas(schema.allOf, 'allOf');
  }

  if (schema.oneOf) {
    processComposedSchemas(schema.oneOf, 'oneOf');
  }

  if (schema.anyOf) {
    processComposedSchemas(schema.anyOf, 'anyOf');
  }

  if (schema.not) {
    processComposedSchemas(schema.not, 'not');
  }

  return errors;
};

module.exports = validateSubschemas;
