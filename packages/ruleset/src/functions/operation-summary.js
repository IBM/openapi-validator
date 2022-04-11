module.exports = function(operation, _opts, { path }) {
  return operationSummary(operation, path);
};

function operationSummary(operation, path) {
  if (!operationHasSummary(operation)) {
    return [
      {
        message: 'Operation "summary" must be present and non-empty string.',

        // If the 'summary' field is defined, then include it in the error path.
        path: 'summary' in operation ? [...path, 'summary'] : path
      }
    ];
  }

  return [];
}

function operationHasSummary(operation) {
  return operation.summary && operation.summary.toString().trim().length;
}
