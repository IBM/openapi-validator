const { isJsonPatchMimeType, isMergePatchMimeType } = require('../utils');

module.exports = function(operation, _opts, { path }) {
  return patchRequestContentType(operation, path);
};

/**
 * This function checks to make sure that each PATCH operation supports only the request
 * content types associated with merge-patch and json-patch style content.
 * Anything else will be logged as a warning.
 * @param {*} operation the patch operation to be checked
 * @param {*} path the array of path segments indicating the "location" of a
 * patch operation within the API definition (e.g. ['paths','/v1/clouds/{cloud_id}', 'patch'])
 * @returns an array containing the violations found or [] if no violations
 */
function patchRequestContentType(operation, path) {
  // The http method should be the last element in "path"
  // (e.g. ['paths', '/v1/clouds/{cloud_id}', 'patch']).
  // Just double-check that we were in fact called with a "patch" operation.
  const method = path[path.length - 1];
  if (method !== 'patch') {
    return [];
  }

  // Make sure we find at least one of these in the requestBody content field.
  let foundJsonPatch = false;
  let foundMergePatch = false;

  if (operation.requestBody && operation.requestBody.content) {
    const content = operation.requestBody.content;
    const errors = [];
    for (const contentType in content) {
      if (isJsonPatchMimeType(contentType)) {
        foundJsonPatch = true;
      } else if (isMergePatchMimeType(contentType)) {
        foundMergePatch = true;
      } else {
        errors.push({
          message: '',
          path: [...path, 'requestBody', 'content', contentType]
        });
      }
    }

    // If we encountered any errors while walking through the content object,
    // then bail out now.
    if (errors.length) {
      return errors;
    }
  }

  // If neither content type was found, then return an error.
  if (!foundJsonPatch && !foundMergePatch) {
    const errorPath = [...path];
    if (operation.requestBody) {
      errorPath.push('requestBody');
      if (operation.requestBody.content) {
        errorPath.push('content');
      }
    }
    return [
      {
        message: '',
        path: errorPath
      }
    ];
  }

  return [];
}
