// Assertions are in the following order ( bailing as soon as we hit the firs assertion )
//

// Assertation typo
// If a paramter with `in: formdata` exists, warn about typo ( it should be formData )

// Assertation 1
// If a paramter with `in: formData` exists, a param with `in: body` cannot

// Assertation 2:
// If a parameter with `type: file` exists
// - It must have `in: formData`
// - The consumes property must have `multipart/form-data`

// Assertation 3:
// If a parameter with `in: formData` exists a consumes property ( inherited or inline ) my contain `application/x-www-form-urlencoded` or `multipart/form-data`

const isObject = require('lodash/isObject');
const getIn = require('lodash/get');
const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ resolvedSpec }) {
  const messages = new MessageCarrier();

  if (!isObject(resolvedSpec)) {
    return;
  }

  // Looking for...
  // Parameters ( /paths/{method}/parameters or /parameters)
  // - in: formData
  // - type: file
  function walk(obj, path) {
    path = path || [];
    if (typeof obj !== 'object' || obj === null) {
      return;
    }

    // Inside a parameter array ( under an operation or pathitem )
    // NOTE: What if we want to add a body, with multipart/form-data? Not possible right?
    if (
      (path[0] === 'paths' || path[0] === 'pathitems') &&
      path[path.length - 1] === 'parameters' &&
      Array.isArray(obj)
    ) {
      const opPath = path.slice(0, path.length - 1);
      const opItem = getIn(resolvedSpec, opPath);

      // Check for formdata ( typos )
      assertationTypo(obj, path);

      return (
        // assertationOne(obj, path)
        assertationTwo(obj, path, opItem) || assertationThree(obj, path, opItem)
      );
    }

    // Parameters under the root `/parameters` property
    if (path[0] === 'parameters' && path.length === 2 && Array.isArray(obj)) {
      // Check for formdata ( typos )
      assertationTypo(obj, path);
      // return assertationOne(obj, path)
    }

    // Continue to walk the object tree
    const keys = Object.keys(obj);
    if (keys) {
      return keys.map(k => walk(obj[k], [...path, k]));
    } else {
      return null;
    }
  }

  // Checks the operation for the presences of a consumes
  function hasConsumes(operation, consumes) {
    return (
      isObject(operation) &&
      Array.isArray(operation.consumes) &&
      operation.consumes.some(c => c === consumes)
    );
  }

  // Warn about a typo, formdata => formData
  function assertationTypo(params, path) {
    const formDataWithTypos = params.filter(
      p => isObject(p) && p['in'] === 'formdata'
    );

    if (formDataWithTypos.length) {
      params.forEach((param, i) => {
        if (param['in'] !== 'formdata') {
          return;
        }
        messages.addMessage(
          `${path.join('.')}.${i}`,
          'The form data value for `in` must be camelCase (formData)',
          'error'
        );
      });
      return;
    }
  }

  // If a paramter with `in: formData` exists, a param with `in: body` cannot
  // eslint-disable-next-line no-unused-vars
  function assertationOne(params, path) {
    // Assertion 1
    const inBodyIndex = params.findIndex(
      p => isObject(p) && p['in'] === 'body'
    );
    const formData = params.filter(p => isObject(p) && p['in'] === 'formData');
    const hasFormData = !!formData.length;

    if (~inBodyIndex && hasFormData) {
      // We"ll blame the `in: body` parameter
      const pathStr = `${path.join('.')}.${inBodyIndex}`;
      messages.addMessage(
        pathStr,
        'Parameters cannot have `in` values of both "body" and "formData", as "formData" _will_ be the body',
        'error'
      );
      return;
    }
  }

  // If a parameter with `type: file` exists
  // - a. It must have `in: formData`
  // - b. The consumes property must have `multipart/form-data`
  function assertationTwo(params, path, operation) {
    const typeFileIndex = params.findIndex(
      p => isObject(p) && p.type === 'file'
    );
    // No type: file?
    if (!~typeFileIndex) {
      return;
    }
    let hasErrors = false;

    const param = params[typeFileIndex];
    const pathStr = [...path, typeFileIndex].join('.');
    // a - must have formData
    if (param['in'] !== 'formData') {
      messages.addMessage(
        pathStr,
        'Parameters with `type` "file" must have `in` be "formData"',
        'error'
      );
      hasErrors = true;
    }

    // - b. The consumes property must have `multipart/form-data`
    if (!hasConsumes(operation, 'multipart/form-data')) {
      messages.addMessage(
        pathStr,
        'Operations with Parameters of `type` "file" must include "multipart/form-data" in their "consumes" property',
        'error'
      );
      hasErrors = true;
    }

    return hasErrors;
  }

  // If a parameter with `in: formData` exists, a consumes property ( inherited or inline ) my contain `application/x-www-form-urlencoded` or `multipart/form-data`
  function assertationThree(params, path, operation) {
    const hasFormData = params.some(p => isObject(p) && p['in'] === 'formData');

    if (!hasFormData) {
      return;
    }

    if (
      hasConsumes(operation, 'multipart/form-data') ||
      hasConsumes(operation, 'application/x-www-form-urlencoded')
    ) {
      return;
    }

    const pathStr = path.slice(0, -1).join('.'); // Blame the operation, not the parameter0
    messages.addMessage(
      pathStr,
      'Operations with Parameters of `in` "formData" must include "application/x-www-form-urlencoded" or "multipart/form-data" in their "consumes" property',
      'error'
    );
    return;
  }

  walk(resolvedSpec, []);
  return messages;
};
