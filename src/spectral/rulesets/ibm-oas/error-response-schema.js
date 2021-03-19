module.exports = function(errorResponseSchema) {
  if (!schemaIsObject(errorResponseSchema)) {
    return [
      {
        message: 'Error response should be an object'
      }
    ];
  }
};

function schemaIsObject(errorResponseSchema) {
  return errorResponseSchema.properties || errorResponseSchema.type === 'object';
}
