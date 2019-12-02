// This validator checks "list" type operations for correct pagaination style.
//
// An operation is considered to be a "list" operation if:
// - its path does not end in a path parameter
// - it is a "get"
// - it contains an array at the top level of the response body object
//
// A "list" operation is considered to be a "paginated list" operation if:
// - it has a `limit` query parameter
//
// The following checks are performed on "paginated list" operations:
// - The `limit` query parameter be type integer, optional, and have default and maximum values.
// - If the operation has an `offset` query parameter, it must be type integer and optional
// - If the operation has a `start`, `cursor`, or `page_token` query parameter, it must be type string and optional
// - The response body must contain a `limit` property that is type integer and required
// - If the operation has an `offset` query parameter, the response body must contain an `offset` property this is type integer and required

module.exports.validate = function({ resolvedSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];
  const checkStatus = config.pagination.pagination_style;

  //when pagnation is turned off, skip all of the pagination checks
  if (checkStatus == 'off') {
    return { errors: [], warnings: [] };
  }

  // Loop through all paths looking for "list" operations.
  for (const path in resolvedSpec.paths) {
    // Skip any path that ends in a path parameter or does not have a "get" operation
    if (/}$/.test(path) || !resolvedSpec.paths[path].get) {
      continue;
    }

    const resp = getJsonResponse(resolvedSpec.paths[path].get);
    const jsonResponse = resp
      ? resolvedSpec.paths[path].get.responses[resp].content['application/json']
      : undefined;
    // Can't check response schema for array property, so skip this path
    if (
      !jsonResponse ||
      !jsonResponse.schema ||
      !jsonResponse.schema.properties
    ) {
      continue;
    }

    // If no array at top level of response, skip this path
    if (
      !Object.values(jsonResponse.schema.properties).some(
        prop => prop.type === 'array'
      )
    ) {
      continue;
    }

    // Check for "limit" query param -- if none, skip this path
    const params = resolvedSpec.paths[path].get.parameters;
    if (
      !params ||
      !params.some(param => param.name === 'limit' && param.in === 'query')
    ) {
      continue;
    }

    // Now we know we have a "paginated list" operation, so lets perform our checks

    // - The `limit` query parameter be type integer, optional, and have default and maximum values.

    const limitParamIndex = params.findIndex(
      param => param.name === 'limit' && param.in === 'query'
    );
    const limitParam = params[limitParamIndex];
    if (
      !limitParam.schema ||
      limitParam.schema.type !== 'integer' ||
      !!limitParam.required ||
      !limitParam.schema.default ||
      !limitParam.schema.maximum
    ) {
      result[checkStatus].push({
        path: ['paths', path, 'get', 'parameters', limitParamIndex],
        message:
          'The limit parameter must be of type integer and optional with default and maximum values.'
      });
    }

    // - If the operation has an `offset` query parameter, it must be type integer and optional

    const offsetParamIndex = params.findIndex(
      param => param.name === 'offset' && param.in === 'query'
    );
    if (offsetParamIndex !== -1) {
      const offsetParam = params[offsetParamIndex];
      if (
        !offsetParam.schema ||
        offsetParam.schema.type !== 'integer' ||
        !!offsetParam.required
      ) {
        result[checkStatus].push({
          path: ['paths', path, 'get', 'parameters', offsetParamIndex],
          message: 'The offset parameter must be of type integer and optional.'
        });
      }
    }

    // - if the operation has a `start`, `cursor`, or `page_token` query parameter, it must be type string and optional

    const startParamNames = ['start', 'cursor', 'page_token'];
    const startParamIndex = params.findIndex(
      param =>
        param.in === 'query' && startParamNames.indexOf(param.name) !== -1
    );
    if (startParamIndex !== -1) {
      const startParam = params[startParamIndex];
      if (
        !startParam.schema ||
        startParam.schema.type !== 'string' ||
        !!startParam.required
      ) {
        result[checkStatus].push({
          path: ['paths', path, 'get', 'parameters', startParamIndex],
          message: `The ${
            startParam.name
          } parameter must be of type string and optional.`
        });
      }
    }

    // - The response body must contain a `limit` property that is type integer and required

    const limitProp = jsonResponse.schema.properties.limit;
    if (!limitProp) {
      result[checkStatus].push({
        path: [
          'paths',
          path,
          'get',
          'responses',
          resp,
          'content',
          'application/json',
          'schema',
          'properties'
        ],
        message: `The response body of a paginated list operation must contain a "limit" property.`
      });
    } else if (
      limitProp.type !== 'integer' ||
      !jsonResponse.schema.required ||
      jsonResponse.schema.required.indexOf('limit') === -1
    ) {
      result[checkStatus].push({
        path: [
          'paths',
          path,
          'get',
          'responses',
          resp,
          'content',
          'application/json',
          'schema',
          'properties',
          'limit'
        ],
        message: `The "limit" property in the response body of a paginated list operation must be of type integer and required.`
      });
    }

    // - If the operation has an `offset` query parameter, the response body must contain an `offset` property this is type integer and required

    if (offsetParamIndex !== -1) {
      const offsetProp = jsonResponse.schema.properties.offset;
      if (!offsetProp) {
        result[checkStatus].push({
          path: [
            'paths',
            path,
            'get',
            'responses',
            resp,
            'content',
            'application/json',
            'schema',
            'properties'
          ],
          message: `The response body of a paginated list operation must contain a "offset" property.`
        });
      } else if (
        offsetProp.type !== 'integer' ||
        !jsonResponse.schema.required ||
        jsonResponse.schema.required.indexOf('offset') === -1
      ) {
        result[checkStatus].push({
          path: [
            'paths',
            path,
            'get',
            'responses',
            resp,
            'content',
            'application/json',
            'schema',
            'properties',
            'offset'
          ],
          message: `The "offset" property in the response body of a paginated list operation must be of type integer and required.`
        });
      }
    }
  }

  return { errors: result.error, warnings: result.warning };
};

function getJsonResponse(operation) {
  if (operation.responses) {
    for (const resp in operation.responses) {
      if (resp.startsWith('2')) {
        const content = operation.responses[resp].content;
        if (content && content['application/json']) {
          return resp;
        }
      }
    }
  }
  return undefined;
}
