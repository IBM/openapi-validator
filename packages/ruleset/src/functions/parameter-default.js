module.exports = function(param, _opts, { path }) {
  return parameterDefault(param, path);
};

const errorMsg = 'Required parameter should not define a default value';

function parameterDefault(param, path) {
  const results = [];

  if (param.required && paramHasDefault(param)) {
    results.push({
      message: errorMsg,
      path
    });
  }

  return results;
}

/**
 * Returns true if 'param' has a default value defined in it.
 * This needs to take into account the oas2 flavor of a parameter
 * where the default value would be defined directly on the param object,
 * and the oas3 flavor where it is defined inside the param's schema.
 */
function paramHasDefault(param) {
  return param.schema
    ? param.schema.default !== undefined
    : param.default !== undefined;
}
