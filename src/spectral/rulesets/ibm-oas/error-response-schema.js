module.exports = function(errorResponseSchema, _opts, paths) {
  const errors = [];
  if (!schemaIsObject(errorResponseSchema)) {
    return [{ message: 'Error response should be an object' }];
  } else {
    const rootPath = paths.target !== void 0 ? paths.target : paths.given;
    errors.push(
      ...validateErrorResponseProperties(
        errorResponseSchema.properties,
        rootPath
      )
    );
  }
  return errors;
};

function validateErrorResponseProperties(errorResponseProperties, rootPath) {
  const errors = [];
  if (!hasTraceField(errorResponseProperties)) {
    errors.push({
      message: 'Error response should have a uuid `trace` field',
      path: [...rootPath, 'properties']
    });
  }
  if (!validStatusCodeField(errorResponseProperties)) {
    errors.push({
      message: '`status_code` field must be an integer',
      path: [...rootPath, 'properties', 'status_code']
    });
  }
  if (errorResponseProperties.errors) {
    // validate `errors` is error model container
    if (errorResponseProperties.errors.type !== 'array') {
      errors.push({
        message: '`errors` field should be an array of error models',
        path: [...rootPath, 'properties', 'errors']
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

function hasTraceField(errorResponseProperties) {
  return (
    errorResponseProperties &&
    errorResponseProperties.trace &&
    errorResponseProperties.trace.type === 'string' &&
    errorResponseProperties.trace.format === 'uuid'
  );
}

function schemaIsObject(errorResponseSchema) {
  return (
    errorResponseSchema.properties || errorResponseSchema.type === 'object'
  );
}
