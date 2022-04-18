// Assertation 1. If a path has a parameter, all operations must have a parameter of type
// 'path' and name 'parameterName' ( parameterName matching what is contained in curly brackets -> {} )
// [Removed]

// Assertation 2. All path parameters must be defined at either the path or operation level.
// [Removed]

// Assertation 3. All path segments are lower snake case

// Assertation 4:
// Identical path parameters should be defined at path level rather than in the operations
// [Removed]

const MessageCarrier = require('../../../utils/message-carrier');

const { checkCase } = require('../../../utils');

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

module.exports.validate = function({ resolvedSpec }, config) {
  const messages = new MessageCarrier();

  config = config.paths;

  const pathNames = resolvedSpec.paths ? Object.keys(resolvedSpec.paths) : [];

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
      const operations = Object.keys(path).filter(pathItem =>
        allowedOperations.includes(pathItem)
      );

      // paths can have a global parameters object that applies to all operations
      let globalParameters = [];
      if (path.parameters) {
        globalParameters = path.parameters
          .filter(param => param.in && param.in.toLowerCase() === 'path')
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

        const missingParameters = [];

        parameters.forEach(name => {
          if (
            !givenParameters.includes(name) &&
            !globalParameters.includes(name)
          ) {
            missingParameters.push(name);
          }
        });
      });

      if (!operations.length) {
        const missingParameters = [];
        parameters.forEach(name => {
          if (!globalParameters.includes(name)) {
            missingParameters.push(name);
          }
        });
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
          messages.addMessage(
            ['paths', pathName],
            `Path segments must be lower snake case.`,
            checkStatus,
            'snake_case_only'
          );
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
              messages.addMessage(
                ['paths', pathName],
                `Path segments must follow case convention: ${caseConvention}`,
                checkStatusPath,
                'paths_case_convention'
              );
            }
          });
        }
      }
    }
  });

  return messages;
};
