module.exports = (path, isOAS3 = true) => {
  const operations = [
    'get',
    'put',
    'post',
    'delete',
    'options',
    'head',
    'patch',
    'trace'
  ];

  const pathLength = path.length;

  // a necessary but not sufficient check for a response object
  // without these, a schema property named "responses"
  // may be validated as a response
  const isResponsesProperty = path[pathLength - 1] === 'responses';

  // three scenarios:
  // 1) inside of an operation
  const isOperationResponse = operations.includes(path[pathLength - 2]);

  // 2) inside of components -> responses (oas 3)
  const isResponseInComponents =
    pathLength === 2 && path[pathLength - 2] === 'components' && isOAS3;

  // 3) top level responses (swagger 2)
  const isTopLevelResponse = pathLength === 1 && !isOAS3;

  return (
    isResponsesProperty &&
    (isOperationResponse || isResponseInComponents || isTopLevelResponse)
  );
};
