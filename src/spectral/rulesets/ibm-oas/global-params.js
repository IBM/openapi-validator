const { each, isEqual, omit } = require('lodash');

const GLOBAL_PARAM_FIELD = 'x-sdk-global-param';

module.exports = function(paths) {
  const pathName = Object.keys(paths)[0];
  const opName = Object.keys(paths[pathName])[0];
  const arbitraryParametersArr = paths[pathName][opName].parameters;
  const allParameterArrays = getAllOrNoParameterArrays(paths);
  if (allParameterArrays.length && arbitraryParametersArr) {
    const results = [];
    each(arbitraryParametersArr, function(arbitraryParam) {
      if (arbitraryParamDefinedInEveryOp(allParameterArrays, arbitraryParam)) {
        results.push(...addWarningsForMissingGlobalTag(arbitraryParam, paths));
      }
    });
    return results;
  }
};

// assumes the given param is a global param
// issues a warning when the known global param does not have `x-sdk-global-param` field
function addWarningsForMissingGlobalTag(globalParam, paths) {
  const warnings = [];
  each(paths, function(path, pathName) {
    each(path, function(operation, opName) {
      each(operation.parameters, function(opParam, index) {
        if (
          globalParamsEqual(globalParam, opParam) &&
          opParam[GLOBAL_PARAM_FIELD] !== true
        ) {
          warnings.push({
            message:
              'parameter defined on every method, add `x-sdk-global-param` field with value `true`',
            path: ['paths', pathName, opName, 'parameters', index]
          });
        }
      });
    });
  });
  return warnings;
}

function arbitraryParamDefinedInEveryOp(allParameterArrays, arbitraryParam) {
  return allParameterArrays.every(function(paramArray) {
    return paramArray.some(function(param) {
      return globalParamsEqual(param, arbitraryParam);
    });
  });
}

// if at least one operation does not have parameters, returns an empty array
// otherwise, returns an array of all the parameter arrays
function getAllOrNoParameterArrays(paths) {
  const allParameterArrays = [];
  each(paths, function(path) {
    each(path, function(operation) {
      if (operation.parameters) {
        allParameterArrays.push(operation.parameters);
      } else {
        // operation has no parameters, so no global parameters to find
        return [];
      }
    });
  });
  return allParameterArrays;
}

function globalParamsEqual(param1, param2) {
  return isEqual(
    omit(param1, GLOBAL_PARAM_FIELD),
    omit(param2, GLOBAL_PARAM_FIELD)
  );
}
