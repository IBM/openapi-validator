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
  } else if (schema.items) {
    errors.push(
      ...validateSubschemas(schema.items, [...path, 'items'], validate)
    );
  } else if (schema.allOf || schema.anyOf || schema.oneOf) {
    const whichType = schema.allOf ? 'allOf' : schema.anyOf ? 'anyOf' : 'oneOf';
    const composedSchemas = schema[whichType];
    if (Array.isArray(composedSchemas)) {
      composedSchemas.forEach((subschema, i) => {
        errors.push(
          ...validateSubschemas(subschema, [...path, whichType, i], validate)
        );
      });
    }
  }

  return errors;
};

module.exports = validateSubschemas;
