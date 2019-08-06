module.exports.validate = function({ resolvedSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];
  config = config.pagination;
  const checkStatus = config.pagination_style;

  //when pagnation is turned off, skip all of the pagination checks
  if (checkStatus == 'off') {
    return;
  }
  //for our case, pagination should only be considered for paths without a path parameter and should apply for get responses for the mean time
  for (const pathHead in resolvedSpec.paths) {
    // Skip any path that ends in a path parameter
    if (/}$/.test(pathHead)) {
      continue;
    }
    // this an array that contains all of the query parameter names
    if (
      resolvedSpec.paths[pathHead].get.parameters &&
      resolvedSpec.paths[pathHead].get.parameters.length > 0
    ) {
      const queryParameters = resolvedSpec.paths[pathHead].get.parameters.map(
        parameter => parameter.name
      );

      // a paginated spec should have one of the following as query parameters
      const isListX =
        queryParameters.includes('limit') ||
        queryParameters.includes('start') ||
        queryParameters.includes('cursor') ||
        queryParameters.includes('token') ||
        queryParameters.includes('offset');
      // apply checks only to get operations for now
      if (resolvedSpec.paths[pathHead].get) {
        for (const resp in resolvedSpec.paths[pathHead].get.responses) {
          if (resp.startsWith('2')) {
            const content =
              resolvedSpec.paths[pathHead].get.responses[resp].content;
            if (content && content['application/json']) {
              const jsonContent = content['application/json'];
              let arrayOnTop = false;
              let trueObj;
              if (
                (jsonContent.schema && jsonContent.schema.properties) ||
                (jsonContent.schema.properties.pagination &&
                  jsonContent.schema.propeerties.pagination.properties)
              ) {
                if (!jsonContent.schema.properties.pagination) {
                  for (const prop in jsonContent.schema.properties) {
                    if (jsonContent.schema.properties[prop].type === 'array') {
                      arrayOnTop = true;
                      trueObj = jsonContent;
                      //console.log(trueObj);
                      break;
                    }
                  }
                }
                const content =
                  resolvedSpec.paths[pathHead].get.responses[resp].content;
                const parameterPath =
                  resolvedSpec.paths[pathHead].get.parameters;
                parameterChecker(parameterPath, content, isListX, arrayOnTop);
                if (arrayOnTop && !jsonContent.schema.pagination && isListX) {
                  const responseSchema = trueObj.schema;
                  const path = [
                    'paths',
                    pathHead,
                    'get',
                    'responses',
                    resp,
                    'content',
                    'application/json',
                    'schema',
                    'properties'
                  ];
                  checkResponseProperties(
                    responseSchema,
                    path,
                    queryParameters,
                    isListX,
                    arrayOnTop
                  );
                } else if (jsonContent.schema.properties.pagination) {
                  const paginatedResponse =
                    jsonContent.schema.properties.pagination;
                  const path = [
                    'paths',
                    pathHead,
                    'get',
                    'reponses',
                    resp,
                    'content',
                    'application/json',
                    'pagination',
                    'schema',
                    'properties'
                  ];
                  checkResponseProperties(
                    paginatedResponse,
                    path,
                    queryParameters,
                    isListX
                  );
                }
              }
            }
          }
        }
      }
    }
  }
  function parameterChecker(parameterPath, content, isListX, arrayOnTop) {
    if (isListX && arrayOnTop) {
      const jsonContent = content['application/json'];
      // loop through parameters and make sure that the pagination related parameters follow the correct defintions
      if (parameterPath.length > 0) {
        for (let i = 0; i < parameterPath.length; i++) {
          const param = parameterPath[i];
          // limit should be an integer, optional, and should have a default and maximum value defined
          if (
            param.name === 'limit' &&
            (param.schema.type !== 'integer' ||
              param.required === true ||
              (jsonContent.schema.properties.limit &&
                (!jsonContent.schema.properties.limit.default ||
                  !jsonContent.schema.properties.limit.maximum)))
          ) {
            const path = ['paths', '/pets', 'get', 'parameters', i];
            const message =
              'The limit parameter must be of type integer and must be optional with default and maximum values.';
            paginationWarning(message, path);
          }
          // The `start` and `cursor` parameters must be strings and are required
          if (
            (param.name === 'start' || param.name === 'cursor') &&
            (param.schema.type !== 'integer' || param.required === true)
          ) {
            const path = [
              'paths',
              '/pets',
              'get',
              'responses',
              '200',
              'content',
              'application/json',
              'schema',
              'properties'
            ];
            const message =
              'The start or cursor properties must be integers and optional.';
            paginationWarning(message, path);
          }
        }
      }
    }
  }

  // this is the message generating function
  function paginationWarning(message, path) {
    result[checkStatus].push({
      path,
      message
    });
  }

  // this function checks the `offset` property in responses
  function checkResponseProperties(obj, path, queryParameters, isListX) {
    if (isListX) {
      if (
        queryParameters.includes('offset') &&
        (!obj.properties.offset ||
          obj.properties.offset.type !== 'integer' ||
          !obj.required.includes('offset'))
      ) {
        const message =
          'If a offset exists as a parameter query it must be defined as a property.';
        paginationWarning(message, path);
      }
      // this function checks the `limit` property in responses
      if (
        queryParameters.includes('limit') &&
        (!obj.properties.limit ||
          obj.properties.limit.type != 'integer' ||
          !obj.required.includes('limit'))
      ) {
        const message =
          'If a limit exists as a parameter query it must be defined as a property.';
        paginationWarning(message, path);
      } // this function checks the `next_token` and `next_cursor` properties in responses
      if (
        (queryParameters.includes('start') ||
          queryParameters.includes('token') ||
          queryParameters.includes('cursor')) &&
        (!obj.properties.next_token && !obj.properties.next_cursor)
      ) {
        const message =
          'If start or token or cursor are  defined then responses must have a `next_token` or `next_cursor` property.';
        paginationWarning(message, path);
      }
      // this function checks the `total_count` property in responses
      if (
        obj.properties.total_count &&
        obj.properties.total_count.type != 'integer'
      ) {
        const message =
          'If total_count is defined, it must be of type integer.';
        paginationWarning(message, path);
      }
      // this function makes sure that there is a `next_url` property
      if (!obj.properties.next_url) {
        const message =
          'A paginated success response must contain the next property.';
        paginationWarning(message, path);
      }
    }
  }
  return { errors: result.error, warnings: result.warning };
};
