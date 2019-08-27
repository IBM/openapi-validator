// Assertation 1:
// Path parameters definition, either at the path-level or the operation-level, need matching paramater declarations

// Assertation 2:
// Path parameter declarations do not allow empty names (/path/{} is not valid)

// Assertation 3:
// Path strings must be (equivalently) different (Example: /pet/{petId} and /pet/{petId2} are equivalently the same and would generate an error)

// Assertation 4:
// Paths must have unique (name + in combination) parameters

// Assertation 5:
// Paths cannot have partial templates. (/path/abc{123} is illegal)

// Assertation 6:
// Paths cannot have literal query strings in them.

const each = require('lodash/each');
const findIndex = require('lodash/findIndex');
const isObject = require('lodash/isObject');

const templateRegex = /\{(.*?)\}/g;

module.exports.validate = function({ resolvedSpec }) {
  const errors = [];
  const warnings = [];

  const seenRealPaths = {};

  const tallyRealPath = path => {
    // ~~ is a flag for a removed template string
    const realPath = path.replace(templateRegex, '~~');
    const prev = seenRealPaths[realPath];
    seenRealPaths[realPath] = true;
    // returns if it was previously seen
    return !!prev;
  };

  each(resolvedSpec.paths, (path, pathName) => {
    if (!path || !pathName) {
      return;
    }

    pathName.split('/').map(substr => {
      // Assertation 5
      if (
        templateRegex.test(substr) &&
        substr.replace(templateRegex, '').length > 0
      ) {
        errors.push({
          path: `paths.${pathName}`,
          message: 'Partial path templating is not allowed.'
        });
      }
    });

    // Assertation 6
    if (pathName.indexOf('?') > -1) {
      errors.push({
        path: `paths.${pathName}`,
        message: 'Query strings in paths are not allowed.'
      });
    }

    const parametersFromPath = path.parameters ? path.parameters.slice() : [];

    const availableParameters = parametersFromPath.map((param, i) => {
      if (!isObject(param)) {
        return;
      }
      param.$$path = `paths.${pathName}.parameters[${i}]`;
      return param;
    });

    each(path, (operation, operationName) => {
      if (
        operation &&
        operation.parameters &&
        Array.isArray(operation.parameters)
      ) {
        availableParameters.push(
          ...operation.parameters.map((param, i) => {
            if (!isObject(param)) {
              return;
            }
            param.$$path = `paths.${pathName}.${operationName}.parameters[${i}]`;
            return param;
          })
        );
      }
    });

    // Assertation 3
    const hasBeenSeen = tallyRealPath(pathName);
    if (hasBeenSeen) {
      errors.push({
        path: `paths.${pathName}`,
        message: 'Equivalent paths are not allowed.'
      });
    }

    // Assertation 4
    each(parametersFromPath, (parameterDefinition, i) => {
      const nameAndInComboIndex = findIndex(parametersFromPath, {
        name: parameterDefinition.name,
        in: parameterDefinition.in
      });
      // comparing the current index against the first found index is good, because
      // it cuts down on error quantity when only two parameters are involved,
      // i.e. if param1 and param2 conflict, this will only complain about param2.
      // it also will favor complaining about parameters later in the spec, which
      // makes more sense to the user.
      if (i !== nameAndInComboIndex && parameterDefinition.in) {
        errors.push({
          path: `paths.${pathName}.parameters[${i}]`,
          message: "Path parameters must have unique 'name' + 'in' properties"
        });
      }
    });

    let pathTemplates = pathName.match(templateRegex) || [];
    pathTemplates = pathTemplates.map(str =>
      str.replace('{', '').replace('}', '')
    );

    // Assertation 1
    each(availableParameters, (parameterDefinition, i) => {
      if (
        isObject(parameterDefinition) &&
        parameterDefinition.in === 'path' &&
        pathTemplates.indexOf(parameterDefinition.name) === -1
      ) {
        errors.push({
          path:
            parameterDefinition.$$path || `paths.${pathName}.parameters[${i}]`,
          message: `Path parameter was defined but never used: ${
            parameterDefinition.name
          }`
        });
      }
    });

    if (pathTemplates) {
      pathTemplates.forEach(parameter => {
        // Assertation 2

        if (parameter === '') {
          // it was originally "{}"
          errors.push({
            path: `paths.${pathName}`,
            message: 'Empty path parameter declarations are not valid'
          });
        }
      });
    } else {
      each(availableParameters, (parameterDefinition, i) => {
        // Assertation 1, for cases when no templating is present on the path
        if (parameterDefinition.in === 'path') {
          errors.push({
            path: `paths.${pathName}.parameters[${i}]`,
            message: `Path parameter was defined but never used: ${
              parameterDefinition.name
            }`
          });
        }
      });
    }
  });

  return { errors, warnings };
};
