module.exports = function(errorResponseSchema, _opts, paths) {
  const errors = [];
  const rootPath = paths.target !== void 0 ? paths.target : paths.given;
  if (!schemaIsObjectWithProperties(errorResponseSchema)) {
    return [
      {
        message: 'Error response should be an object with properties',
        path: rootPath
      }
    ];
  } else {
    errors.push(
      ...validateErrorResponseProperties(errorResponseSchema, rootPath)
    );
  }
  return errors;
};

function validateErrorResponseProperties(errorResponseSchema, pathToSchema) {
  const errors = [];
  const errorResponseProperties = errorResponseSchema.properties;
  const pathToProperties = [...pathToSchema, 'properties'];
  if (!hasTraceField(errorResponseProperties)) {
    errors.push({
      message: 'Error response should have a uuid `trace` field',
      path: [...pathToProperties, 'trace']
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
  } else {
    // no `errors` or `error` field, so expect error model at top level of schema
    errors.push(...validateErrorModelSchema(errorResponseSchema, pathToSchema));
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
          'Error Model should contain `code` field, a snake-case, string error code',
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
    errorModelSchemaProperties.code.type === 'string'
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
    errorResponseProperties.trace &&
    errorResponseProperties.trace.type === 'string'
  );
}

function schemaIsObjectWithProperties(errorResponseSchema) {
  return !!errorResponseSchema.properties;
}
