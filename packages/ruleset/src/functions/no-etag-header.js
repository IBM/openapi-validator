module.exports = function(pathItem, options, { path }) {
  return etagHeaderCheck(pathItem, path);
};

/**
 * This function checks a path item (object containing operations) to make sure that
 * the path's GET operation defines the ETag response header if needed.
 * An ETag response header is needed if there are other operations within the same
 * path that support the If-Match or If-Not-Match header parameters.
 *
 * @param {*} pathItem the object containing the set of operations for a given path string
 * @param {*} path the array of path segments indicating the "location" of a
 * pathItem within the API definition (e.g. ['paths','/v1/clouds/{id}'])
 * @returns an array containing the violations found or [] if no violations
 */
function etagHeaderCheck(pathItem, path) {
  // If no operations define the If-Match/If-None-Match header params, then bail out now.
  if (!isETagNeeded(pathItem)) {
    return [];
  }

  // Make sure there is an ETag response header defined within the pathItem's GET operation.

  // 1. Make sure there is a GET operation.
  const getOperation = pathItem['get'];
  if (!getOperation) {
    return [
      {
        message:
          'ETag response header is required, but no "get" operation is defined',
        path
      }
    ];
  }

  // 2. Make sure that EACH success response entry defines the ETag response header.
  const errors = [];
  let numSuccessResponses = 0;
  const responses = getOperation.responses;
  if (responses) {
    for (const statusCode in responses) {
      // Only interested in "success" response entries.
      if (/2[0-9][0-9]/.test(statusCode)) {
        numSuccessResponses++;

        let etagHeader;
        const response = responses[statusCode];
        if (response && response.headers) {
          for (const headerName of Object.keys(response.headers)) {
            if (headerName.toLowerCase() === 'etag') {
              etagHeader = response.headers[headerName];
            }
          }
        }

        if (!etagHeader) {
          let errorPath = [...path, 'get', 'responses', statusCode];
          if (response && response.headers) {
            errorPath = [...errorPath, 'headers'];
          }
          errors.push({
            message: 'ETag response header is required',
            path: errorPath
          });
        }
      }
    }
  }

  // Finally, make sure that we found at least one success response entry.
  if (!numSuccessResponses) {
    errors.push({
      message:
        'ETag response header is required, but "get" operation defines no success responses',
      path: [...path, 'get']
    });
  }

  return errors;
}

/**
 * Returns true iff an ETag response header should be defined within
 * the specified pathItem's "get" operation.
 * @param {*} pathItem the object containing the operations for a given path string
 * @returns boolean
 */
function isETagNeeded(pathItem) {
  // An ETag response header is needed if any of the pathItem's operations
  // define an 'If-Match' or 'If-None-Match' header parameter.
  const headersToCheck = ['If-Match', 'If-None-Match'];

  // Check to see if either of the headers are defined in the pathItem's parameter list.
  // If so, then no need to check the individual operations.
  if (headerParamsPresent(pathItem.parameters, headersToCheck)) {
    return true;
  }

  // Next, visit the operations and check their parameter lists.
  for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
    const operation = pathItem[method];
    if (operation) {
      if (headerParamsPresent(operation.parameters, headersToCheck)) {
        return true;
      }
    }
  }
  return false;
}

// Checks to see if any of the names within "headerNames" match the name
// of a header param defined within "paramList".
function headerParamsPresent(paramList, headerNames) {
  if (Array.isArray(paramList)) {
    for (const p of paramList) {
      if (p.in.toLowerCase() === 'header') {
        for (const headerName of headerNames) {
          if (headerName.toLowerCase() === p.name.toLowerCase()) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
