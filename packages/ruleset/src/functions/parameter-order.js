module.exports = function(operation, _opts, { path }) {
  return parameterOrder(operation, path);
};

function parameterOrder(op, path) {
  if (op.parameters && op.parameters.length > 0) {
    const errors = [];

    // Walk the list of parameters and report on any required params
    // that are listed after the first optional param.
    let haveOptional = false;
    for (let index = 0; index < op.parameters.length; index++) {
      const param = op.parameters[index];

      if (param.required === true) {
        if (haveOptional) {
          errors.push({
            message:
              'Required parameters should appear before optional parameters.',
            path: [...path, 'parameters', index.toString()]
          });
        }
      } else {
        haveOptional = true;
      }
    }

    return errors;
  }

  return [];
}
