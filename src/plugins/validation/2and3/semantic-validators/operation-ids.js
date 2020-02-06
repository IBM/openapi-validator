// Assertation 1: Operations must have a unique operationId.

// Assertation 2: OperationId must conform to naming conventions.

const pickBy = require('lodash/pickBy');
const reduce = require('lodash/reduce');
const merge = require('lodash/merge');
const each = require('lodash/each');

module.exports.validate = function({ resolvedSpec }) {
  const errors = [];
  const warnings = [];

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
      each(pathOps, (op, opKey) =>
        arr.push(
          merge(
            {
              pathKey: `${pathKey}`,
              opKey: `${opKey}`,
              path: `paths.${pathKey}.${opKey}`
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
    hasPathParam
  ) => {
    // Only consider paths for which
    // - paths with no path param has a GET and POST path
    // - paths with path param has a GET, a DELETE, and a POST or PUT or PATCH.

    let checkPassed = true;
    const verbs = [];

    if (!hasPathParam) {
      // operationId for GET should starts with "list"
      if (opKey === 'get' && !operationId.match(/^list[a-zA-Z0-9_]+/m)) {
        checkPassed = false;
        verbs.push('list');
      }

      // operationId for POST should starts with "create" or "add"
      if (
        opKey === 'post' &&
        !operationId.match(/^(add|create)[a-zA-Z0-9_]+/m)
      ) {
        checkPassed = false;
        verbs.push('add');
        verbs.push('create');
      }
    } else {
      // operationId for GET should starts with "get"
      if (opKey === 'get' && !operationId.match(/^get[a-zA-Z0-9_]+/m)) {
        checkPassed = false;
        verbs.push('get');
      }

      // operationId for DELETE should starts with "delete"
      if (opKey === 'delete' && !operationId.match(/^delete[a-zA-Z0-9_]+/m)) {
        checkPassed = false;
        verbs.push('delete');
      }

      // operationId for POST should start with "update" or "create"
      if (
        opKey === 'post' &&
        !operationId.match(/^(create|update)[a-zA-Z0-9_]+/m)
      ) {
        checkPassed = false;
        verbs.push('create');
        verbs.push('update');
      }

      // operationId for PUT/PATCH should starts with "update"
      if (
        ['put', 'patch'].includes(opKey) &&
        !operationId.match(/^update[a-zA-Z0-9_]+/m)
      ) {
        checkPassed = false;
        verbs.push('update');
      }
    }
    return { checkPassed, verbs };
  };

  operations.forEach(op => {
    // wrap in an if, since operationIds are not required
    if (op.operationId) {
      const hasBeenSeen = tallyOperationId(op.operationId);
      if (hasBeenSeen) {
        // Assertation 1: Operations must have a unique operationId.
        errors.push({
          path: op.path + '.operationId',
          message: 'operationIds must be unique'
        });
      } else {
        // Assertation 2: OperationId must conform to naming conventions
        const regex = RegExp(/{[a-zA-Z0-9_-]+\}/m);

        const { checkPassed, verbs } = operationIdPassedConventionCheck(
          op['opKey'],
          op.operationId,
          regex.test(op['pathKey'])
        );

        if (checkPassed === false) {
          warnings.push({
            path: op.path + '.operationId',
            message: `operationIds should follow consistent naming convention. operationId verb should be ${verbs}`.replace(
              ',',
              ' or '
            )
          });
        }
      }
    }
  });

  return { errors, warnings };
};
