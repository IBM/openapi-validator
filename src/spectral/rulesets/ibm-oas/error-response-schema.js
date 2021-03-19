module.exports = function(errorResponseSchema) {
  let errors = [];
  if (!schemaIsObject(errorResponseSchema)) {
    return [{ message: 'Error response should be an object' }];
  } else {
    errors.push(
      ...validateErrorResponseProperties(errorResponseSchema.properties)
    );
  }
  return errors;
};

function validateErrorResponseProperties(errorResponseProperties) {
  let errors = [];
  if (!hasTraceField(errorResponseProperties)) {
    errors.push({ message: 'Error response should have a uuid `trace` field' });
  }
  return errors;
}

function hasTraceField(errorResponseProperties) {
  return errorResponseProperties && errorResponseProperties.trace && errorResponseProperties.trace.type === 'string' && errorResponseProperties.trace.format === 'uuid';
}

function schemaIsObject(errorResponseSchema) {
  return (
    errorResponseSchema.properties || errorResponseSchema.type === 'object'
  );
}
