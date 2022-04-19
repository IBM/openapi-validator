module.exports = function(operation, _opts, { path }) {
  return checkForArrayResponses(operation, path);
};

/**
 * Checks for operations that are defined as returning a top-level array in
 * a response. This is considered a bad practice.  Instead, the response body
 * should be defined as an object with a property that contains the array.
 * This provides flexibility to expand the response body definition in the future.
 * @param {*} op the operation to check
 * @param {*} path the array of path segments indicating the "location" of the pathItem within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function checkForArrayResponses(op, path) {
  const errors = [];

  // Check for an array schema within each response.
  for (const [responseCode, response] of Object.entries(op.responses || {})) {
    for (const [mimeType, contentEntry] of Object.entries(
      response.content || {}
    )) {
      const isArrayResponse =
        contentEntry.schema &&
        (contentEntry.schema.type === 'array' || contentEntry.schema.items);
      if (isArrayResponse) {
        errors.push({
          message:
            'Operations should not return an array as the top-level structure of a response.',
          path: [
            ...path,
            'responses',
            responseCode,
            'content',
            mimeType,
            'schema'
          ]
        });
      }
    }
  }

  return errors;
}
