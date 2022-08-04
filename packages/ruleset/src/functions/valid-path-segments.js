module.exports = function(pathItem, options, { path }) {
  return validatePathSegments(path);
};

/**
 * This function validates individual path segments within a path string.
 * Specifically, we'll check to make sure that a path segment that contains
 * a parameter reference (or at least appears to) actually contains only that
 * parameter reference and nothing more.
 * @param {*} path the array of path segments indicating the "location" of a
 * pathItem within the API definition (e.g. ['paths','/v1/clouds/{id}'])
 * @returns an array containing the violations found or [] if no violations
 */
function validatePathSegments(path) {
  // The path string itself (e.g. '/v1/clouds/{id}') will be the last element in 'path'.
  const pathStr = path[path.length - 1].toString();

  // Parse the path string into the individual path segments.
  const segments = pathStr.split('/');

  // Validate each path segment.
  const errors = [];
  for (const segment of segments) {
    // If it looks like the user intended to define a path param reference
    // (i.e. if we find either '{' or '}' within the path segment),
    // then check to make sure the segment only contains a single
    // path param reference.
    if (segment.indexOf('{') >= 0 || segment.indexOf('}') >= 0) {
      if (!/^{[^}]*}$/.test(segment)) {
        errors.push({
          message: `Invalid path parameter reference within path segment: ${segment}`,
          path
        });
      }
    }
  }

  return errors;
}
