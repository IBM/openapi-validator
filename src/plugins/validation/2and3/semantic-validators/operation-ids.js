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

    if (!hasPathParam) {
      // operationId for GET should starts with "list"
      if (opKey === 'get' && !operationId.match(/^list[a-zA-Z0-9_]+/m)) {
        checkPassed = false;
      }

      // operationId for POST should starts with "create" or "add"
      if (
        opKey === 'post' &&
        !operationId.match(/^(add|create)[a-zA-Z0-9_]+/m)
      ) {
        checkPassed = false;
      }
    } else {
      // operationId for GET should starts with "get"
      if (opKey === 'get' && !operationId.match(/^get[a-zA-Z0-9_]+/m)) {
        checkPassed = false;
      }

      // operationId for DELETE should starts with "delete"
      if (opKey === 'delete' && !operationId.match(/^delete[a-zA-Z0-9_]+/m)) {
        checkPassed = false;
      }

      // operationId for POST/PUT/PATCH should starts with "update"
      if (
        ['put', 'post', 'patch'].includes(opKey) &&
        !operationId.match(/^update[a-zA-Z0-9_]+/m)
      ) {
        checkPassed = false;
      }
    }
    return checkPassed;
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

        const checkPassed = operationIdPassedConventionCheck(
          op['opKey'],
          op.operationId,
          regex.test(op['pathKey'])
        );

        if (checkPassed === false) {
          warnings.push({
            path: op.path + '.operationId',
            message: `operationIds should follow consistent naming convention`
          });
        }
      }
    }
  });

  return { errors, warnings };
};
