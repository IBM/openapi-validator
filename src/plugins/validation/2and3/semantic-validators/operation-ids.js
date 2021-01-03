// Assertation 1: Operations must have a unique operationId.

// Assertation 2: OperationId must conform to naming conventions.

const pickBy = require('lodash/pickBy');
const reduce = require('lodash/reduce');
const merge = require('lodash/merge');
const each = require('lodash/each');
const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ resolvedSpec }, config) {
  const messages = new MessageCarrier();

  config = config.operations;

  const validOperationKeys = [
    'get',
    'head',
    'post',
    'put',
    'patch',
    'delete',
    'options',
    'trace'
  ];

  const operations = reduce(
    resolvedSpec.paths,
    (arr, path, pathKey) => {
      const pathOps = pickBy(path, (obj, k) => {
        return validOperationKeys.indexOf(k) > -1;
      });
      const allPathOperations = Object.keys(pathOps);
      each(pathOps, (op, opKey) =>
        arr.push(
          merge(
            {
              pathKey: `${pathKey}`,
              opKey: `${opKey}`,
              path: `paths.${pathKey}.${opKey}`,
              allPathOperations
            },
            op
          )
        )
      );
      return arr;
    },
    []
  );

  const seenOperationIds = {};

  const tallyOperationId = operationId => {
    const prev = seenOperationIds[operationId];
    seenOperationIds[operationId] = true;
    // returns if it was previously seen
    return !!prev;
  };

  const operationIdPassedConventionCheck = (
    opKey,
    operationId,
    allPathOperations,
    pathEndsWithParam
  ) => {
    // Only consider paths for which
    // - paths that do not end with param has a GET and POST operation
    // - paths that end with param has a GET, DELETE, POST, PUT or PATCH.

    const verbs = [];

    if (!pathEndsWithParam) {
      // operationId for GET should starts with "list"
      if (opKey === 'get') {
        verbs.push('list');
      }
      // operationId for POST should starts with "create" or "add"
      else if (opKey === 'post') {
        verbs.push('add');
        verbs.push('create');
      }
    } else {
      // operationId for GET should starts with "get"
      if (opKey === 'get') {
        verbs.push('get');
      }
      // operationId for DELETE should starts with "delete"
      else if (opKey === 'delete') {
        verbs.push('delete');
      }
      // operationId for PATCH should starts with "update"
      else if (opKey === 'patch') {
        verbs.push('update');
      }
      // If PATCH operation doesn't exist for path, POST operationId should start with "update"
      else if (opKey === 'post') {
        if (!allPathOperations.includes('patch')) {
          verbs.push('update');
        }
      }
      // operationId for PUT should starts with "replace"
      else if (opKey === 'put') {
        verbs.push('replace');
      }
    }

    if (verbs.length > 0) {
      const checkPassed = verbs
        .map(verb => operationId.startsWith(verb))
        .some(v => v);
      return { checkPassed, verbs };
    }

    return { checkPassed: true };
  };

  operations.forEach(op => {
    // wrap in an if, since operationIds are not required
    if (op.operationId) {
      const hasBeenSeen = tallyOperationId(op.operationId);
      if (hasBeenSeen) {
        // Assertation 1: Operations must have a unique operationId.
        messages.addMessage(
          op.path + '.operationId',
          'operationIds must be unique',
          'error'
        );
      } else {
        // Assertation 2: OperationId must conform to naming conventions

        // We'll use a heuristic to decide if this path is part of a resource oriented API.
        // If path ends in path param, look for corresponding create/list path
        // Conversely, if no path param, look for path with path param

        const pathEndsWithParam = op.pathKey.endsWith('}');
        const isResourceOriented = pathEndsWithParam
          ? Object.keys(resolvedSpec.paths).includes(
              op.pathKey.replace('/\\{[A-Za-z0-9-_]+\\}$', '')
            )
          : Object.keys(resolvedSpec.paths).some(p =>
              p.startsWith(op.pathKey + '/{')
            );

        if (isResourceOriented) {
          const { checkPassed, verbs } = operationIdPassedConventionCheck(
            op['opKey'],
            op.operationId,
            op.allPathOperations,
            pathEndsWithParam
          );

          if (checkPassed === false) {
            messages.addMessage(
              op.path + '.operationId',
              `operationIds should follow naming convention: operationId verb should be ${verbs}`.replace(
                ',',
                ' or '
              ),
              config.operation_id_naming_convention,
              'operation_id_naming_convention'
            );
          }
        }
      }
    }
  });

  return messages;
};
