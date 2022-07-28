const { casing } = require('@stoplight/spectral-functions');
let casingConfig;

module.exports = function(operation, options, { path }) {
  // Save this rule's "functionOptions" value since we need
  // to pass it on to Spectral's "casing" function.
  casingConfig = options;

  return operationIdCaseConvention(operation, path);
};

function operationIdCaseConvention(operation, path) {
  // Bypass the check if the operationId value is missing (the existence
  // of an operationId value is checked by the 'operation-operationId' rule).
  const operationId =
    operation.operationId && operation.operationId.toString().trim();
  if (!operationId) {
    return [];
  }

  const result = casing(operationId, casingConfig);
  if (result) {
    // Update the message to clarify that it is an operationId value that is incorrect,
    // and update the path.
    result[0].message = 'Operation ids ' + result[0].message;
    result[0].path = [...path, 'operationId'];
    return [result[0]];
  }

  return [];
}
