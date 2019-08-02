// Assertation 1: Operations must have a unique operationId.

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
  const normalParams = [];
  const queryParams = [];
  for (const head in resolvedSpec.paths) {
    if (!/}$/.test(head)) {
      normalParams.push(head);
    } else {
      queryParams.push(head);
    }
  }
  for (const i in normalParams) {
    for (const j in queryParams) {
      if (
        queryParams[j].includes(normalParams[i]) &&
        resolvedSpec.paths[normalParams[i]].get &&
        resolvedSpec.paths[normalParams[i]].post &&
        resolvedSpec.paths[queryParams[j]].get &&
        resolvedSpec.paths[queryParams[j]].delete &&
        (resolvedSpec.paths[queryParams[j]].put ||
          resolvedSpec.paths[queryParams[j]].post ||
          resolvedSpec.paths[queryParams[j]].patch)
      ) {
        if (
          !resolvedSpec.paths[normalParams[i]].get.operationId.startsWith(
            'list'
          )
        ) {
          warnings.push({
            path: [
              'paths',
              resolvedSpec.paths[normalParams[i]],
              'get',
              'operationId'
            ],
            message:
              'get `operationId` in a parent parameter should begin with `list`'
          });
        }
        if (
          !resolvedSpec.paths[normalParams[i]].post.operationId.startsWith(
            'add'
          ) &&
          !resolvedSpec.paths[normalParams[i]].post.operationId.startsWith(
            'create'
          )
        ) {
          warnings.push({
            path: [
              'paths',
              resolvedSpec.paths[normalParams[i]],
              'post',
              'operationId'
            ],
            message:
              'post `operationId` in a parent parameter should begin with `add` or `create`'
          });
        }

        if (
          !resolvedSpec.paths[queryParams[j]].get.operationId.startsWith('get')
        ) {
          warnings.push({
            path: [
              'paths',
              resolvedSpec.paths[queryParams[j]],
              'get',
              'operationId'
            ],
            message:
              'get `operationId` in query parameter should begin with `get`'
          });
        }

        if (
          !resolvedSpec.paths[queryParams[j]].delete.operationId.startsWith(
            'delete'
          )
        ) {
          warnings.push({
            path: [
              'paths',
              resolvedSpec.paths[queryParams[j]],
              'delete',
              'operationId'
            ],
            message:
              'delete `operationId` in query parameter should begin with delete'
          });
        }
        if (
          (resolvedSpec.paths[queryParams[j]].post &&
            !resolvedSpec.paths[queryParams[j]].post.operationId.startsWith(
              'update'
            )) ||
          (resolvedSpec.paths[queryParams[j]].put &&
            !resolvedSpec.paths[queryParams[j]].put.operationId.startsWith(
              'update'
            )) ||
          (resolvedSpec.paths[queryParams[j]].patch &&
            !resolvedSpec.paths[queryParams[j]].patch.operationId.startsWith(
              'update'
            ))
        ) {
          warnings.push({
            path: ['paths', resolvedSpec.paths[queryParams[j]]],
            message:
              'post/put/patch `operationId` in query parameter should begin with `update`'
          });
        }
      }
    }
  }
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

  operations.forEach(op => {
    // wrap in an if, since operationIds are not required
    if (op.operationId) {
      const hasBeenSeen = tallyOperationId(op.operationId);
      if (hasBeenSeen) {
        errors.push({
          path: op.path + '.operationId',
          message: 'operationIds must be unique'
        });
      }
    }
  });

  return { errors, warnings };
};
