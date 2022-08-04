module.exports = function(pathItem, options, { path }) {
  return consecutivePathParamSegments(path);
};

/**
 * This function detects the presence of two or more consecutive path segments
 * containing path parameter references (e.g. '/v1/clouds/{cloud_id}/{region_id}').
 * @param {*} path the array of path segments indicating the "location" of a
 * pathItem within the API definition (e.g. ['paths','/v1/clouds/{id}'])
 * @returns an array containing the violations found or [] if no violations
 */
function consecutivePathParamSegments(path) {
  // The path string itself (e.g. '/v1/clouds/{id}') will be the last element in 'path'.
  const pathStr = path[path.length - 1].toString();

  // Check to see if the path string has two or more consecutive path segments
  // containing a path parameter reference (e.g. '/v1/clouds/{cloud_id}/{region_id}').
  if (/{[^/]+}\/{[^/]+}/.test(pathStr)) {
    return [
      {
        message: `Path contains two or more consecutive path parameter references: ${pathStr}`,
        path
      }
    ];
  }

  return [];
}
