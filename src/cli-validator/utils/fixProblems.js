const each = require('lodash/each');
const fs = require('fs');
const snakeCase = require('snake-case');
const camelCase = require('camelcase');
const yaml = require('js-yaml');
const ext = require('./fileExtensionValidator');

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

  const originalFileIsJSON = ext.getFileExtension(validFile) === 'json';

  let originalObj;
  if (originalFileIsJSON) {
    originalObj = JSON.parse(originalFile);
  } else {
    originalObj = yaml.safeLoad(originalFile);
  }

  const paramsToDelete = {};
  const paramsToPrepend = {};
  const newPathNames = {};
  const definitionsToDelete = [];

  // Mark a parameter for deletion given a path array
  const markForDeletion = path => {
    const pathstr = path.slice(0, path.length - 1).join(',');
    if (pathstr in paramsToDelete) {
      paramsToDelete[pathstr].push(path[path.length - 1]);
    } else {
      paramsToDelete[pathstr] = [path[path.length - 1]];
    }
  };

  // Given a path array to a parameter and it's parent,
  // mark a required property that needs to be reordered in front of
  // an optional property in the parent array of parameters.
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
    let obj = originalObj;
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
        const newpath = [];
        path.forEach(item => {
          if (item.includes('[')) {
            newpath.push(item.split('[')[0]);
            newpath.push(item.split('[')[1].slice(0, -1));
          } else {
            newpath.push(item);
          }
        });
        path = newpath;

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
          definitionsToDelete.push(path);
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
          // Create a security schema if it does not exist and remove the
          // found Authorization security field. Use the field description if it exists.
          // Only perform this on IAM security for now
          if (obj['description'].includes('IAM')) {
            if (!('security' in originalObj)) {
              originalObj['security'] = [{ IAM: [] }];
              originalObj['components']['securitySchemes'] = {
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
          message.includes(
            'operationIds should follow consistent naming convention'
          )
        ) {
          const validVerbs = [
            'get',
            'create',
            'add',
            'list',
            'update',
            'replace',
            'delete'
          ];

          const messageArray = message.split(' ');
          const verb = messageArray[messageArray.length - 1];
          if (validVerbs.includes(verb)) {
            const previousOpIdArray = snakeCase
              .snakeCase(parent[path[path.length - 1]])
              .toLowerCase()
              .split('_');
            let updatedOpIdArray;
            // handling case where the first word in the opId is a verb but should be a different verb.
            // for example, 'update' used when it should have been 'replace'
            if (validVerbs.includes(previousOpIdArray[0])) {
              updatedOpIdArray = previousOpIdArray;
              updatedOpIdArray[0] = verb;
            } else {
              updatedOpIdArray = [verb, ...previousOpIdArray];
            }
            const opIdCase =
              configObject['shared']['operations'][
                'operation_id_case_convention'
              ][1];
            if (opIdCase === 'lower_snake_case') {
              parent[path[path.length - 1]] = updatedOpIdArray
                .join('_')
                .toLowerCase();
            } else if (opIdCase === 'upper_snake_case') {
              parent[path[path.length - 1]] = updatedOpIdArray
                .join('_')
                .toUpperCase();
            } else if (opIdCase === 'lower_camel_case') {
              parent[path[path.length - 1]] = camelCase(
                updatedOpIdArray.join('_')
              );
            }
          }
        } else if (
          message.includes('operationIds must follow case convention')
        ) {
          const opIdCase =
            configObject['shared']['operations'][
              'operation_id_case_convention'
            ][1];
          if (opIdCase === 'lower_snake_case') {
            parent[path[path.length - 1]] = snakeCase.snakeCase(
              parent[path[path.length - 1]]
            );
          } else if (opIdCase === 'upper_snake_case') {
            parent[path[path.length - 1]] = snakeCase
              .snakeCase(parent[path[path.length - 1]])
              .toUpperCase();
          } else if (opIdCase === 'lower_camel_case') {
            parent[path[path.length - 1]] = camelCase(
              parent[path[path.length - 1]]
            );
          }
        } else if (
          message.includes(
            'Required parameters should appear before optional parameters.'
          )
        ) {
          markForMoving(path, parent);
          markForDeletion(path);
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
  definitionsToDelete.forEach(path => {
    const { parent } = getObjectFromPath(path);
    delete parent[path[path.length - 1]];
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
      let i;
      for (i = 0; i <= obj.length && obj[i]['required']; i++);
      const indexToInsert = i - 1;
      paramsToPrepend[path].forEach(paramToPrepend => {
        obj.splice(indexToInsert, 0, paramToPrepend);
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

  let updatedObj;
  if (originalFileIsJSON) {
    updatedObj = JSON.stringify(originalObj, null, 2);
  } else {
    updatedObj = yaml.safeDump(originalObj, { indent: 2 });
  }
  if (doFixProblemsNewFile) {
    console.log('Writing Fixes to new file');
    const newfile =
      validFile.substr(0, validFile.lastIndexOf('.')) +
      '_new' +
      validFile.substr(validFile.lastIndexOf('.'), validFile.length - 1);
    fs.writeFileSync(newfile, updatedObj);
  } else {
    console.log('Writing Fixes in-place');
    fs.writeFileSync(validFile, updatedObj);
  }
};
