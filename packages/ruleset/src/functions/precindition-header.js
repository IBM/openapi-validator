module.exports = function(operation, _opts, context) {
  return preconditionHeader(operation, context.path);
};

/**
 * This function checks if an operation contains a 412 response it must support at least one conditional header.
 * @param {*} operation an operation within the API definition
 * @param {*} path the array of path segments indicating the "location" of the operation within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function preconditionHeader(operation, path) {
  if (!operation.responses) {
    return [];
  }

  if (Object.keys(operation.responses).includes('412')) {
    const conditionalHeaders = [
      'If-Match',
      'If-None-Match',
      'If-Modified-Since',
      'If-Unmodified-Since'
    ];
    let found = false;
    for (const k in operation.parameters) {
      if (conditionalHeaders.includes(operation.parameters[k].name)) {
        found = true;
      }
    }

    if (!found) {
      return [
        {
          message:
            'An operation that returns a 412 status code must support at least one conditional header',
          path: [...path, 'resonses']
        }
      ];
    }
  }

  return [];
}
