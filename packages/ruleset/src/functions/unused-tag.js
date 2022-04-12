// Set of fields within a "path item" that we expect to hold an operation object.
const operationMethods = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace'
];

/**
 * This function implements the 'unused-tag' validation rule.
 * The specific checks that are performed are:
 *
 * 1. Each tag defined in the global "tags" field must be referenced by at least one operation.
 *
 * @param {object} rootDocument the entire API definition (assumed to be an OpenAPI 3 document)
 * @returns an array of error objects
 */
function unusedTag(rootDocument) {
  // Compile a list of all the tags.
  const globalTags = rootDocument.tags || [];

  // If no tags defined, then bail out now.
  if (!globalTags.length) {
    return [];
  }

  // Set of tags used by at least one operation.
  const usedTags = new Set();

  // Visit each operation and add its tag(s) to "usedTags".
  if (rootDocument.paths) {
    for (const pathStr in rootDocument.paths) {
      const pathItem = rootDocument.paths[pathStr];
      // Within the pathItem, visit only those fields that hold operations.
      for (const methodName of operationMethods) {
        const operationObj = pathItem[methodName];
        if (operationObj && operationObj.tags) {
          for (const tag of operationObj.tags) {
            usedTags.add(tag);
          }
        }
      }
    }
  }

  const errors = [];

  // Finally, report on any unused tags.
  for (const i in globalTags) {
    if (!usedTags.has(globalTags[i].name)) {
      errors.push({
        message: `A tag is defined but never used: ${globalTags[i].name}`,
        path: ['tags', i.toString()]
      });
    }
  }

  return errors;
}

module.exports = {
  unusedTag
};
