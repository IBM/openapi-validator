module.exports = function(schema, _opts, paths) {
  const rootPath = paths.target !== void 0 ? paths.target : paths.given;
  return traverseSchema(schema, rootPath);
};

function traverseSchema(schema, path) {
  if (schema.type === 'string') {
    return stringBoundaryErrors(schema, path);
  }
  const errors = [];
  if (schema.properties) {
    Object.entries(schema.properties).forEach(function(prop) {
      const propName = prop[0];
      const propSchema = prop[1];
      errors.push(
        ...traverseSchema(propSchema, [...path, 'properties', propName])
      );
    });
  } else if (schema.items) {
    errors.push(...traverseSchema(schema.items, [...path, 'items']));
  } else if (schema.allOf || schema.anyOf || schema.oneOf) {
    const whichComposedSchemaType = schema.allOf
      ? 'allOf'
      : schema.anyOf
      ? 'anyOf'
      : 'oneOf';
    const composedSchemas = schema[whichComposedSchemaType];
    if (Array.isArray(composedSchemas)) {
      composedSchemas.forEach(function(composedSchema, index) {
        errors.push(
          ...traverseSchema(composedSchema, [
            ...path,
            whichComposedSchemaType,
            index
          ])
        );
      });
    }
  }
  return errors;
}

function stringBoundaryErrors(stringSchema, path) {
  const errors = [];
  if (isUndefinedOrNull(stringSchema.enum)) {
    if (
      isUndefinedOrNull(stringSchema.pattern) &&
      !['binary', 'date', 'date-time'].includes(stringSchema.format)
    ) {
      errors.push({
        message: 'Should define a pattern for a valid string',
        path
      });
    }
    if (isUndefinedOrNull(stringSchema.minLength)) {
      errors.push({
        message: 'Should define a minLength for a valid string',
        path
      });
    }
    if (isUndefinedOrNull(stringSchema.maxLength)) {
      errors.push({
        message: 'Should define a maxLength for a valid string',
        path
      });
    }
    if (
      !isUndefinedOrNull(stringSchema.minLength) &&
      !isUndefinedOrNull(stringSchema.maxLength) &&
      stringSchema.minLength > stringSchema.maxLength
    ) {
      errors.push({
        message: 'minLength must be less than maxLength',
        path
      });
    }
  }
  return errors;
}

function isUndefinedOrNull(obj) {
  return obj === undefined || obj === null;
}
