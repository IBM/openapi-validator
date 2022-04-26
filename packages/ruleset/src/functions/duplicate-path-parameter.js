const flatten = require('lodash/flatten');
const isEqual = require('lodash/isEqual');
const uniqWith = require('lodash/uniqWith');
const { operationMethods } = require('../utils');

module.exports = function(pathItem, _opts, { path }) {
  return duplicatePathParameter(pathItem, path);
};

// Regex used to identify references to path params within a path string.
const pathParamReferenceRegex = /\{(.*?)\}/g;

/**
 * This function checks to make sure that path parameters are defined on the
 * path object if the path object contains more than one operation.
 * The rationale is that when a path has multiple operations, it makes sense
 * to define each path parameter once on the path object rather than within
 * each operation.
 *
 * @param {*} pathItem the path item that potentially contains parameters and operations.
 * @param {*} path the array of path segments indicating the "location" of the pathItem within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function duplicatePathParameter(pathItem, path) {
  // The actual path string (e.g. '/v1/resources/{resource_id}') will be the last element in 'path'.
  const pathStr = path[path.length - 1];

  // Find the names of all path params referenced within the path string.
  let paramRefs = pathStr.match(pathParamReferenceRegex);

  // If we have any path param references in the path string, then perform the checks.
  if (paramRefs) {
    // The matches returned by match() will still have braces around them, so remove those now.
    paramRefs = paramRefs.map(ref => {
      return ref.slice(1, -1);
    });

    // Gather the set of keys in this path item that contain operations.
    const operationKeys = Object.keys(pathItem).filter(op =>
      operationMethods.includes(op)
    );

    // If we have more than one operation, then perform the checks.
    if (operationKeys.length > 1) {
      const errors = [];

      for (const paramName of paramRefs) {
        // We'll collect a list of unique parameters named <paramName>
        // from the operations under this pathItem.
        const operationPathParams = uniqWith(
          flatten(
            operationKeys
              .map(opKey => pathItem[opKey].parameters)
              .filter(Boolean)
          ).filter(p => p.name === paramName),
          isEqual
        );

        // If we end up with a single unique parameter, then we need to
        // recommend that it's defined on the path object instead.
        if (operationPathParams.length === 1) {
          for (const opKey of operationKeys) {
            if (pathItem[opKey].parameters) {
              const paramIndex = pathItem[opKey].parameters.findIndex(
                p => p.name === paramName
              );
              if (paramIndex >= 0) {
                errors.push({
                  message:
                    'Common path parameters should be defined on path object',
                  path: [...path, opKey, 'parameters', paramIndex.toString()]
                });
              }
            }
          }
        }
      }

      return errors;
    }
  }

  return [];
}
