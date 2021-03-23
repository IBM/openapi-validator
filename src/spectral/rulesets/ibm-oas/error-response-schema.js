module.exports = function(errorResponseSchema, _opts, paths) {
  const errors = [];
  if (!schemaIsObjectWithProperties(errorResponseSchema)) {
    return [{ message: 'Error response should be an object with properties' }];
  } else {
    const rootPath = paths.target !== void 0 ? paths.target : paths.given;
    errors.push(
      ...validateErrorResponseProperties(errorResponseSchema.properties, [
        ...rootPath,
        'properties'
      ])
    );
  }
  return errors;
};

function validateErrorResponseProperties(
  errorResponseProperties,
  pathToProperties
) {
  const errors = [];
  if (!hasTraceField(errorResponseProperties)) {
    errors.push({
      message: 'Error response should have a uuid `trace` field',
      path: pathToProperties
    });
  }
  if (!validStatusCodeField(errorResponseProperties)) {
    errors.push({
      message: '`status_code` field must be an integer',
      path: [...pathToProperties, 'status_code']
    });
  }
  if (errorResponseProperties.errors) {
    // validate `errors` is error model container
    if (errorResponseProperties.errors.type !== 'array') {
      errors.push({
        message: '`errors` field should be an array of error models',
        path: [...pathToProperties, 'errors']
      });
    } else {
      // `errors` is error model container, so validate the items
      // are valid error models
      errors.push(
        ...validateErrorModelSchema(errorResponseProperties.errors.items, [
          ...pathToProperties,
          'errors',
          'items'
        ])
      );
    }
  } else if (errorResponseProperties.error) {
    // expect a single error model, validate error model schema
    errors.push(
      ...validateErrorModelSchema(errorResponseProperties.error, [
        ...pathToProperties,
        'error'
      ])
    );
  }
  return errors;
}

function validateErrorModelSchema(errorModelSchema, pathToSchema) {
  const errors = [];
  if (!schemaIsObjectWithProperties(errorModelSchema)) {
    errors.push({
      message: 'Error Model should be an object with properties',
      path: pathToSchema
    });
  } else {
    // error model has properties, validate the properties
    if (!hasCodeField(errorModelSchema.properties)) {
      errors.push({
        message:
          'Error Model should contain `code` field, a snake-case, string, enum error code',
        path: [...pathToSchema, 'properties', 'code']
      });
    }
    if (!hasMessageField(errorModelSchema.properties)) {
      errors.push({
        message: 'Error Model should contain a string, `message`, field',
        path: [...pathToSchema, 'properties', 'message']
      });
    }
    if (!hasMoreInfoField(errorModelSchema.properties)) {
      errors.push({
        message:
          'Error Model should contain `more_info` field that contains a URL with more info about the error',
        path: [...pathToSchema, 'properties', 'more_info']
      });
    }
  }
  return errors;
}

function validStatusCodeField(errorResponseProperties) {
  // valid if no status_code provided or if the provided status_code is an integer
  return (
    !errorResponseProperties.status_code ||
    errorResponseProperties.status_code.type === 'integer'
  );
}

function hasCodeField(errorModelSchemaProperties) {
  return (
    errorModelSchemaProperties.code &&
    errorModelSchemaProperties.code.type === 'string' &&
    errorModelSchemaProperties.code.enum
  );
}

function hasMessageField(errorModelSchemaProperties) {
  return (
    errorModelSchemaProperties.message &&
    errorModelSchemaProperties.message.type === 'string'
  );
}

function hasMoreInfoField(errorModelSchemaProperties) {
  return (
    errorModelSchemaProperties.more_info &&
    errorModelSchemaProperties.more_info.type === 'string'
  );
}

function hasTraceField(errorResponseProperties) {
  return (
    errorResponseProperties &&
    errorResponseProperties.trace &&
    errorResponseProperties.trace.type === 'string' &&
    errorResponseProperties.trace.format === 'uuid'
  );
}

function schemaIsObjectWithProperties(errorResponseSchema) {
  return !!errorResponseSchema.properties;
}
