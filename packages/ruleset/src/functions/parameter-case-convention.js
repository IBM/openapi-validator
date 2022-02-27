const { casing } = require('@stoplight/spectral-functions');
const { isSdkExcluded, isDeprecated } = require('../utils');

// Error message prefix for each parameter type.
const errorMsgPrefix = {
  query: 'Query parameter names ',
  path: 'Path parameter names ',
  header: 'Header parameter names '
};

const errorMsgNoName = 'Parameters must have a name';
const errorMsgNoIn = "Parameters must have a valid 'in' value";

module.exports = function(param, options, { path }) {
  return parameterCaseConvention(param, path, options);
};

/**
 * This function will check 'param' to make sure that its name
 * follows the appropriate case convention, depending on its parameter type.
 * @param {*} param the parameter object to check
 * @param {*} path the location of 'param' within the OpenAPI document
 * @param {*} casingConfig this is the value of the 'functionOptions' field
 * within this rule's definition (see src/rules/parameter-case-convention.js).
 * This should be an object with an entry (key) for each parameter type (i.e. 'in' value).
 * The value of each entry should be an object which is the config to be
 * passed to Spectral's casing() function to enforce case conventions for that parameter type.
 * @returns an array containing zero or more error objects
 */
function parameterCaseConvention(param, path, casingConfig) {
  // Don't bother enforcing the rule on excluded or deprecated parameters.
  if (isSdkExcluded(param) || isDeprecated(param)) {
    return [];
  }

  const errors = [];

  // First, let's make sure the 'name' and 'in' properties are present.
  let hasName = true;
  let hasIn = true;
  if (!isNonEmptyString(param.name)) {
    errors.push({
      message: errorMsgNoName,
      path
    });
    hasName = false;
  }
  if (!isNonEmptyString(param.in)) {
    errors.push({
      message: errorMsgNoIn,
      path
    });
    hasIn = false;
  }

  // If we have 'name' and 'in' properties, then check for the proper casing.
  if (hasName && hasIn) {
    const paramIn = param.in
      .toString()
      .trim()
      .toLowerCase();

    // Retrieve the config for the appropriate param type and then use it
    // to invoke the casing() function.
    const config = casingConfig[paramIn];
    const msgPrefix = errorMsgPrefix[paramIn];
    if (config && msgPrefix) {
      const result = casing(param.name, config);

      // casing() will return either an array with 1 element or undefined.
      // We'll prepend the returned error message with our prefix.
      if (result) {
        errors.push({
          message: msgPrefix + result[0].message,
          path
        });
      }
    }
  }

  return errors;
}

function isNonEmptyString(s) {
  return s && s.toString().trim().length;
}
