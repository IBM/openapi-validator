const { casing } = require('@stoplight/spectral-functions');
let casingConfig;

module.exports = function(pathItem, options, { path }) {
  // Save this rule's "functionOptions" value since we need
  // to pass it on to Spectral's "casing" function.
  casingConfig = options;

  return pathSegmentCaseConvention(path);
};

function pathSegmentCaseConvention(path) {
  // The path string (e.g. '/v1/resources/{resource_id}') will be the last element in 'path'.
  const pathStr = path[path.length - 1];

  // Parse the path string into the individual path segments
  let pathSegments = pathStr.split('/');

  // Filter out the path segments that are either "" (the first one due to the
  // path string starting with "/") or a path param reference,
  // since we don't want to raise errors for those.
  pathSegments = pathSegments.filter(
    s => s !== '' && s.indexOf('{') < 0 && s.indexOf('}') < 0
  );

  const errors = [];
  for (const segment of pathSegments) {
    const result = casing(segment, casingConfig);
    if (result) {
      // Update the message to clarify that it is an operationId value that is incorrect,
      // and update the path.
      result[0].message = 'Path segments ' + result[0].message + ': ' + segment;
      result[0].path = path;
      errors.push(result[0]);
    }
  }

  return errors;
}
