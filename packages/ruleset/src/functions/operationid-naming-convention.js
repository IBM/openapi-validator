/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { each, merge, pickBy, reduce } = require('lodash');
const { operationMethods } = require('../utils');
const inflected = require('inflected');

module.exports = function (rootDocument, options) {
  return operationIdNamingConvention(rootDocument, options.strict);
};

function operationIdNamingConvention(resolvedSpec, fullNamingCheck) {
  const operations = reduce(
    resolvedSpec.paths,
    (arr, path, pathKey) => {
      const pathOps = pickBy(path, (obj, k) => {
        return operationMethods.indexOf(k) > -1;
      });
      const allPathOperations = Object.keys(pathOps);
      each(pathOps, (op, opKey) =>
        arr.push(
          merge(
            {
              pathKey: `${pathKey}`,
              opKey: `${opKey}`,
              path: ['paths', `${pathKey}`, `${opKey}`],
              allPathOperations,
            },
            op
          )
        )
      );
      return arr;
    },
    []
  );

  const errors = [];

  operations.forEach(op => {
    if (op.operationId) {
      const pathEndsWithParam = op.pathKey.endsWith('}');

      const numParamRefs = (op.pathKey.match(/\{[A-Za-z0-9-_]+\}/g) || [])
        .length;

      // We'll use a heuristic to decide if this path is part of a resource oriented API.
      // If the path ends in a path param reference, look for the corresponding path
      // without the trailing path param reference.
      // Conversely, if path doesn't end with a path param reference, look for the corresponding
      // path with the trailing path param reference.
      const isResourceOriented = pathEndsWithParam
        ? Object.keys(resolvedSpec.paths).includes(
            op.pathKey.replace('/\\{[A-Za-z0-9-_]+\\}$', '')
          )
        : Object.keys(resolvedSpec.paths).some(p =>
            p.startsWith(op.pathKey + '/{')
          );

      const { checkPassed, correctIds, operationId, verbs } =
        operationIdPassedConventionCheck(
          isResourceOriented,
          op['opKey'],
          op.operationId,
          pathEndsWithParam,
          numParamRefs,
          op.pathKey,
          fullNamingCheck
        );

      if (checkPassed === false) {
        if (fullNamingCheck) {
          errors.push({
            message: `operationIds should follow naming convention: operationId should be ${correctIds.join(
              ' or '
            )} but it's ${operationId} instead`,
            path: [...op.path, 'operationId'],
          });
        } else {
          errors.push({
            message: `operationIds should follow naming convention: operationId verb should be ${verbs.join(' or ')}`,
            path: [...op.path, 'operationId'],
          });
        }
      }
    }
  });

  return errors;
}

/**
 * This function checks to make sure that the operation's operationId starts with
 * an acceptable verb (e.g. 'create', 'list', etc.) depending on various
 * characteristics of the operation's path and http method.
 *
 * This function and the table below should be kept in sync with the API Handbook guidance in this area,
 * located here: https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-operations
 * The following table attempts to capture these rules so that the logic below is a little
 * easier to understand:
 *
 * HTTP   |                              | Resource  | Does path end | # of param    | Acceptable     | Operation ID
 * Method | Path Example                 | Oriented? | w/ param ref? | refs in path  | Verbs          | Examples
 * -------+------------------------------+-----------+---------------+---------------+----------------+---------------------------------
 * get    | /bands                       |    Y      | N             | 0+            | list           | list_bands
 *        | /bands/{id}                  |    Y      | Y             | 1             | get            | get_band
 *        | /bands/{id}/albums/{album_id}|    Y      | Y             | 2+            | get, check     | get_band_album, check_band_album
 *        | dc                           |    N      | dc            | dc            | dc             | <no check>
 *        |                              |           |               |               |                |
 * post   | /bands                       |    Y      | N             | dc            | create         | create_band
 *        | dc                           |    N      | dc            | dc            | dc             | <no check>
 *        |                              |           |               |               |                |
 * patch  | /bands/{id}                  |    dc     | dc            | dc            | update         | update_band
 *        |                              |           |               |               |                |
 * put    | /bands                       |    Y      | N             | 0             | replace        | replace_bands
 *        | /bands/{id}                  |    Y      | Y             | 1             | replace        | replace_band
 *        | /bands/{id}/albums           |    N      | N             | 1+            | replace, set   | replace_band_albums, set_band_albums
 *        | /bands/{id}/albums/{album_id}|    Y      | Y             | 2+            | replace, add   | replace_band_album, add_band_album
 *        |                              |           |               |               |                |
 * delete | /bands                       |    dc     | N             | 0+            | delete         | delete_bands
 *        | /bands/{id}                  |    dc     | Y             | 1             | delete         | delete_band
 *        | /bands/{id}/albums/{album_id}|    Y      | Y             | 2+            | delete, remove | delete_band_album, remove_band_album
 *        | /bands/{id}/albums           |    Y      | N             | 0+            | delete         | delete_band_albums
 *        | /bands/{id}/albums           |    N      | N             | 1+            | delete, unset  | delete_band_albums, unset_band_albums
 *        |                              |           |               |               |                |
 *
 * Legend:
 * - "dc" = don't care
 * - resource-oriented implies a particular path is part of a pair of paths that differ only in that one has a trailing
 *   path parameter reference and one does not (e.g. '/albums' and '/albums/{album_id}').
 *
 * Please try to keep this table in sync with the API Handbook guidance and the logic in the function below.
 *
 * @param {boolean} isResourceOriented a flag that indicates whether the operation is resource-oriented or not
 * @param {string}  httpMethod the http method (get, post, etc.) associated with the operation
 * @param {string}  operationId the operation's operationId
 * @param {boolean} pathEndsWithParam a flag that indicates whether or not the path ends with a path parameter reference
 * @param {number}  numParamRefs the number of path parameter references in the path
 * @param {string}  fullPath the full path of the operation
 * @returns
 */
function operationIdPassedConventionCheck(
  isResourceOriented,
  httpMethod,
  operationId,
  pathEndsWithParam,
  numParamRefs,
  fullPath,
  fullNamingCheck
) {
  // Useful for debugging.
  // console.log(`Debug: ${httpMethod} ${isResourceOriented} ${pathEndsWithParam} ${numParamRefs}  ${operationId}`);

  const verbs = [];

  // Verbs where pluralization can happen in the operationId based on the path.
  const pluralVerbs = ['list', 'replace', 'set', 'delete', 'remove', 'unset'];

  switch (httpMethod) {
    case 'get':
      if (isResourceOriented) {
        if (!pathEndsWithParam) {
          verbs.push('list');
        } else {
          verbs.push('get');
        }
        if (numParamRefs >= 2) {
          verbs.push('check');
        }
      }
      break;

    case 'post':
      if (isResourceOriented) {
        verbs.push('create');
      }
      break;

    case 'patch':
      verbs.push('update');
      break;

    case 'put':
      verbs.push('replace');
      if (isResourceOriented) {
        if (pathEndsWithParam && numParamRefs >= 2) {
          verbs.push('add');
        }
      } else if (!pathEndsWithParam && numParamRefs >= 1) {
        verbs.push('set');
      }
      break;

    case 'delete':
      verbs.push('delete');
      if (isResourceOriented) {
        if (pathEndsWithParam && numParamRefs >= 2) {
          verbs.push('remove');
        }
      } else if (!pathEndsWithParam && numParamRefs >= 1) {
        verbs.push('unset');
      }
      break;
  }

  if (verbs.length === 0) return { checkPassed: true };

  // If we have an acceptable verb, then make sure
  // that the operationId starts with that verb
  // and that the rest of the operation id matches
  // the path according to the naming conventions
  if (fullNamingCheck) {
    const convertedPath = fullPath
      .replace(/^\/+/, '')
      .split('/')
      .filter(part => !part.startsWith('{') && !part.endsWith('}'))
      .filter(part => !/^v\d+$/.test(part));

    const isPlural = pluralVerbs.some(verb => verbs.includes(verb));

    // Singularize the words in the path according to the naming conventions.
    for (let i = 0; i < convertedPath.length; i++) {
      if (i !== convertedPath.length - 1 || !isPlural || pathEndsWithParam)
        convertedPath[i] = inflected.singularize(convertedPath[i]);
    }

    const correctIds = [];

    for (let i = 0; i < verbs.length; i++) {
      const correctId = verbs[i] + '_' + convertedPath.join('_');
      if (correctId === operationId) return { checkPassed: true };
      else correctIds.push(correctId);
    }

    return { checkPassed: false, correctIds, operationId };
  } else {
    if (verbs.length > 0) {
      const checkPassed = verbs
        .map(verb => operationId.startsWith(verb))
        .some(v => v);
      return { checkPassed, verbs: verbs };
    }
  }
}
