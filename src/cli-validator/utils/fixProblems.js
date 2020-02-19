const each = require('lodash/each');
const fs = require('fs');
const snakeCase = require('snake-case');
const camelCase = require('camelcase');

// this function prints all of the output
module.exports = function print(
  results,
  originalFile,
  errorsOnly,
  validFile,
  doFixProblemsNewFile,
  configObject
) {
  const types = errorsOnly ? ['errors'] : ['errors', 'warnings'];

  const originalJSON = JSON.parse(originalFile);

  const paramsToDelete = {};
  const paramsToPrepend = {};
  const newPathNames = {};
  const definitionsToDelete = {};

  // Mark a parameter for deletion given a path separated by commas
  const markForDeletion = path => {
    const pathstr = path.slice(0, path.length - 1).join(',');
    if (pathstr in paramsToDelete) {
      paramsToDelete[pathstr].push(path[path.length - 1]);
    } else {
      paramsToDelete[pathstr] = [path[path.length - 1]];
    }
  };

  // Mark a parameter for moving (reordering) given a path separated by commas
  const markForMoving = (path, parent) => {
    const pathstr = path.slice(0, path.length - 1).join(',');
    if (
      !(
        pathstr in paramsToDelete &&
        path[path.length - 1] in paramsToDelete[pathstr]
      )
    ) {
      if (pathstr in paramsToPrepend) {
        paramsToPrepend[pathstr].push(parent[path[path.length - 1]]);
      } else {
        paramsToPrepend[pathstr] = [parent[path[path.length - 1]]];
      }
    }
  };

  // Unmark a parameter for Moving if it is already marked for deletion
  const unmarkIfMarkedForMoving = (path, parent) => {
    const pathstr = path.slice(0, path.length - 1).join(',');
    const compFunc = param =>
      JSON.stringify(param) === JSON.stringify(parent[path[path.length - 1]]);
    if (
      pathstr in paramsToPrepend &&
      paramsToPrepend[pathstr].findIndex(compFunc) != -1
    ) {
      paramsToPrepend[pathstr].splice(
        paramsToPrepend[pathstr].findIndex(compFunc),
        1
      );
    }
  };

  // Given a path array, traverse down the path on the original JSON object
  // Return the found object and up to three parents
  const getObjectFromPath = path => {
    const pathcopy = path.slice(0);
    let obj = originalJSON;
    let parent, pParent, ppParent;
    while (pathcopy.length) {
      ppParent = pParent;
      pParent = parent;
      parent = obj;
      obj = obj[pathcopy.shift()];
    }
    return { obj, parent, pParent, ppParent };
  };

  // For each problem type and for every problem
  types.forEach(type => {
    each(results[type], problems => {
      problems.forEach(problem => {
        const message = problem.message.split(':')[0];
        let path = problem.path;
        // path needs to be an array to get the line number
        if (!Array.isArray(path)) {
          path = path.split('.');
        }

        // In the case that a path includes brackets ['path', 'to', 'array[index]'],
        // remove the brackets and add the index inside as a new element ['path', 'to', 'array', 'index']
        if (path[path.length - 1].includes('[')) {
          path.push(path[path.length - 1].split(']')[0].split('[')[1]);
          path[path.length - 2] = path[path.length - 2].split(['['])[0];
        }

        // Get object and it's parents from path
        const { obj, parent, ppParent } = getObjectFromPath(path);

        // Fix changes based on given warning or error message
        if (message.includes('Schema must have a non-empty description')) {
          // obj['description'] = path[path.length - 1];
        } else if (
          message.includes(
            'Schema properties must have a description with content in it'
          )
        ) {
          // parent['description'] = path[path.length - 2];
        } else if (
          message.includes('Definition was declared but never used in document')
        ) {
          definitionsToDelete[path.join(',')] = true;
        } else if (
          message.includes(
            'Common path parameters should be defined on path object'
          )
        ) {
          const paramToAdd = parent[path[path.length - 1]];
          if ('parameters' in ppParent) {
            const exists = ppParent['parameters'].some(
              param => param.name === paramToAdd.name
            );
            if (!exists) {
              ppParent['parameters'].push(paramToAdd);
            }
          } else {
            ppParent['parameters'] = [paramToAdd];
          }
          markForDeletion(path);
          unmarkIfMarkedForMoving(path, parent);
        } else if (
          message.includes(
            'Rely on the `securitySchemas` and `security` fields to specify authorization methods.'
          )
        ) {
          if (obj['description'].includes("IAM")) {
            if (!('security' in originalJSON)) {
              originalJSON['security'] = [{ IAM: [] }];
              originalJSON['components']['securitySchemes'] = {
                IAM: {
                  type: 'apiKey',
                  name: 'Authorization',
                  description: obj['description']
                    ? obj['description']
                    : 'Your IBM Cloud IAM access token.',
                  in: 'header'
                }
              };
            }
            markForDeletion(path);
            unmarkIfMarkedForMoving(path, parent);
          }
        } else if (
          message.includes('operationIds must follow case convention')
        ) {
          let opIdCase = configObject['shared']['operations']['operation_id_case_convention'][1];
          if (opIdCase === "lower_snake_case") {
            parent[path[path.length - 1]] = snakeCase.snakeCase(
              parent[path[path.length - 1]]
            );
          } else if (opIdCase === "upper_snake_case") {
            parent[path[path.length - 1]] = snakeCase.snakeCase(
              parent[path[path.length - 1]]
            ).toUpperCase();
          } else if (opIdCase === "lower_camel_case") {
            parent[path[path.length - 1]] = camelCase(parent[path[path.length - 1]]);
          }
        } else if (
          message.includes(
            'Required parameters should appear before optional parameters.'
          )
        ) {
          markForDeletion(path);
          markForMoving(path, parent);
        } else if (
          message.includes('Property names must follow case convention')
        ) {
          // This fix would require server-side changes for the API
          // parent[snakeCase.snakeCase(path[path.length-1])] = parent[path[path.length-1]];
          // delete parent[path[path.length-1]];
        } else if (
          message.includes('Path segments must follow case convention')
        ) {
          // This fix would require server-side changes for the API
          // newPathNames[path.join('.')] = 1;
        } else if (
          message.includes('Parameter names must follow case convention')
        ) {
          // This fix would require server-side changes for the API
          // obj['name'] = snakeCase.snakeCase(obj['name']);
        } else if (
          message.includes('A 204 response MUST NOT include a message-body')
        ) {
          delete parent['content'];
        }
      });
    });
  });

  console.log('Deleting Definitions');
  Object.keys(definitionsToDelete).forEach(path => {
    const patharr = path.split(',');
    const { parent } = getObjectFromPath(patharr);
    delete parent[patharr[patharr.length - 1]];
  });

  console.log('Deleting/moving Parameters');
  Object.keys(paramsToDelete).forEach(path => {
    const patharr = path.split(',');
    const { obj } = getObjectFromPath(patharr);
    paramsToDelete[path].sort().reverse();
    paramsToDelete[path].forEach(paramToDelete => {
      obj.splice(paramToDelete, 1);
    });
    if (path in paramsToPrepend) {
      paramsToPrepend[path].forEach(paramToPrepend => {
        obj.unshift(paramToPrepend);
      });
      paramsToPrepend[path] = [];
    }
  });

  console.log('Renaming Paths');
  Object.keys(newPathNames).forEach(path => {
    path = path.split('.');
    const { parent } = getObjectFromPath(path);
    const pathSegments = path[path.length - 1].split('/');
    pathSegments.forEach((segment, i) => {
      if (segment.includes('{')) {
        // pathSegments[i] = "{" + snakeCase.snakeCase(segment) + "}";
      } else {
        pathSegments[i] = snakeCase.snakeCase(segment);
      }
    });
    parent[pathSegments.join('/')] = parent[path[path.length - 1]];
    delete parent[path[path.length - 1]];
  });

  const fixedJSON = JSON.stringify(originalJSON, null, 2);
  if (doFixProblemsNewFile) {
    console.log('Writing Fixes to new file');
    const newfile =
      validFile.substr(0, validFile.lastIndexOf('.')) +
      '_new' +
      validFile.substr(validFile.lastIndexOf('.'), validFile.length - 1);
    fs.writeFileSync(newfile, fixedJSON);
  } else {
    console.log('Writing Fixes in-place');
    fs.writeFileSync(validFile, fixedJSON);
  }
};
