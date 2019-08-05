// Assertation 1. If a path has a parameter, all operations must have a parameter of type
// 'path' and name 'parameterName' ( parameterName matching what is contained in curly brackets -> {} )

// Assertation 2. All path parameters must be defined at either the path or operation level.

// Assertation 3. All path segments are lower snake case

const { checkCase } = require('../../../utils');

module.exports.validate = function({ resolvedSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.paths;

  const pathNames = Object.keys(resolvedSpec.paths);

  pathNames.forEach(pathName => {
    // get all path parameters contained in curly brackets
    const regex = /\{(.*?)\}/g;
    let parameters = pathName.match(regex);

    // there are path parameters, check each operation to make sure they are defined
    if (parameters) {
      // parameter strings will still have curly braces around them
      //   from regex match - take them out
      parameters = parameters.map(param => {
        return param.slice(1, -1);
      });

      const path = resolvedSpec.paths[pathName];
      const allowedOperations = [
        'get',
        'put',
        'post',
        'delete',
        'options',
        'head',
        'patch',
        'trace'
      ];
      const operations = Object.keys(path).filter(pathItem =>
        allowedOperations.includes(pathItem)
      );

      // paths can have a global parameters object that applies to all operations
      let globalParameters = [];
      if (path.parameters) {
        globalParameters = path.parameters
          .filter(param => param.in.toLowerCase() === 'path')
          .map(param => param.name);
      }

      operations.forEach(opName => {
        const operation = path[opName];

        // ignore validating excluded operations
        if (operation['x-sdk-exclude'] === true) {
          return;
        }

        // get array of 'names' for parameters of type 'path' in the operation
        let givenParameters = [];
        if (operation.parameters) {
          givenParameters = operation.parameters
            .filter(param => param.in && param.in.toLowerCase() === 'path')
            .map(param => param.name);
        }

        let accountsForAllParameters = true;
        const missingParameters = [];

        parameters.forEach(name => {
          if (
            !givenParameters.includes(name) &&
            !globalParameters.includes(name)
          ) {
            accountsForAllParameters = false;
            missingParameters.push(name);
          }
        });

        if (!accountsForAllParameters) {
          const checkStatus = config.missing_path_parameter;
          if (checkStatus != 'off') {
            missingParameters.forEach(name => {
              result[checkStatus].push({
                path: `paths.${pathName}.${opName}.parameters`,
                message: `Operation must include a path parameter with name: ${name}.`
              });
            });
          }
        }
      });

      if (!operations.length) {
        let accountsForAllParameters = true;
        const missingParameters = [];
        parameters.forEach(name => {
          if (!globalParameters.includes(name)) {
            accountsForAllParameters = false;
            missingParameters.push(name);
          }
        });
        if (!accountsForAllParameters) {
          const checkStatus = config.missing_path_parameter;
          if (checkStatus != 'off') {
            missingParameters.forEach(name => {
              result[checkStatus].push({
                path: `paths.${pathName}`,
                message: `Path parameter must be defined at the path or the operation level: ${name}.`
              });
            });
          }
        }
      }
    }

    // enforce path segments are lower snake case
    const checkStatus = config.snake_case_only;
    if (checkStatus != 'off') {
      const segments = pathName.split('/');
      segments.forEach(segment => {
        // the first element will be "" since pathName starts with "/"
        // also, ignore validating the path parameters
        if (segment === '' || segment[0] === '{') {
          return;
        }
        if (!checkCase(segment, 'lower_snake_case')) {
          result[checkStatus].push({
            path: `paths.${pathName}`,
            message: `Path segments must be lower snake case.`
          });
        }
      });
    } else {
      // in the else block because usage of paths_case_convention is mutually
      // exclusive with usage of config.snake_case_only since it is overlapping
      // functionality
      if (config.paths_case_convention) {
        const checkStatusPath = config.paths_case_convention[0];
        if (checkStatusPath !== 'off') {
          const caseConvention = config.paths_case_convention[1];
          const segments = pathName.split('/');
          segments.forEach(segment => {
            // the first element will be "" since pathName starts with "/"
            // also, ignore validating the path parameters
            if (segment === '' || segment[0] === '{') {
              return;
            }
            const isCorrectCase = checkCase(segment, caseConvention);
            if (!isCorrectCase) {
              result[checkStatusPath].push({
                path: `paths.${pathName}`,
                message: `Path segments must follow case convention: ${caseConvention}`
              });
            }
          });
        }
      }
    }
  });

  return { errors: result.error, warnings: result.warning };
};
