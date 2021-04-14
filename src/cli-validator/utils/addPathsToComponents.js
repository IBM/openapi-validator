const { each } = require('lodash');
const getPathAsArray = require('./getPathAsArray');

// takes validator results dictionary in the format:
//   {
//     errors: {
//       validator-name: [
//         {
//           path: [path, to, error],
//           message: 'error message',
//           rule: rule_name
//         },
//       ],
//     },
//     warnings: ...
//   }
//
// adds path to the originating component if it exists
// modifies the given results object
module.exports = function(originalResults, unresolvedSpec) {
  each(originalResults, function(validatorsDict) {
    each(validatorsDict, function(errors) {
      pointToComponents(errors, unresolvedSpec);
    });
  });
};

// takes an array of validator errors:
//   [
//     {
//       path: [path, to, error],
//       message: 'error message',
//       rule: rule_name
//     },
//   ]
//
// adds componentPath field to existing errors
// modifies existing errors in place
function pointToComponents(errors, unresolvedSpec) {
  each(errors, function(err) {
    const pathArray = getPathAsArray(err.path);
    let componentPath = null;
    let refObj = findRef(pathArray, unresolvedSpec);
    while (refObj.refString !== null) {
      componentPath = [
        ...parseRefString(refObj.refString),
        ...refObj.remainingPath
      ];
      refObj = findRef(componentPath, unresolvedSpec);
    }
    // only add the componentPath if the componentPath exists
    // and it is the result of a valid path.
    // protects against invalid $refs from the user and against
    // bugs in the path to the error.
    if (componentPath && refObj.validPath) {
      err.componentPath = componentPath;
    }
  });
}

function findRef(pathArray, unresolvedSpec) {
  let ref = null;
  let indexOfRef = 0;
  let currentObj = unresolvedSpec;
  let validPath = true;
  for (let i = 0; i < pathArray.length && currentObj; ++i) {
    let nextKey = pathArray[i];
    if (Array.isArray(currentObj)) {
      // convert the key to an index
      nextKey = Number(nextKey);
      if (!(nextKey >= 0 && nextKey < currentObj.length)) {
        validPath = false;
        break;
      }
    } else if (!(nextKey in currentObj)) {
      if ('$ref' in currentObj) {
        ref = currentObj['$ref'];
        indexOfRef = i;
      } else if (i != pathArray.length - 1) {
        // nextKey is not in the object
        // no $ref in the object
        // nextKey is not the last element of the path
        // hence, the given path is invalid
        validPath = false;
      }
      break;
    }
    currentObj = currentObj[nextKey];
  }
  return {
    refString: ref,
    remainingPath: pathArray.slice(indexOfRef, pathArray.length),
    validPath: validPath
  };
}

function parseRefString(refString) {
  const refArray = refString.split('/');
  return refArray.slice(refArray.indexOf('#') + 1, refArray.length);
}
