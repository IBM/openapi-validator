module.exports = function(operation, _opts, { path }) {
  return deleteBody(operation, path);
};

// This rule warns about a delete operation if it has a requestBody.
function deleteBody(operation, path) {
  // Grab the http method from the end of the path.
  const method = path[path.length - 1].trim().toLowerCase();

  // Return a warning if we're looking at a "delete" that has a requestBody.
  if (method === 'delete' && 'requestBody' in operation) {
    return [
      {
        message: '"delete" operation should not contain a requestBody.',
        path: [...path, 'requestBody']
      }
    ];
  }

  return [];
}
