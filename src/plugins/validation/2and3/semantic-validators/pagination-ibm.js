module.exports.validate = function({ resolvedSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];
  config = config.pagination;
  const checkStatus = config.pagination_style;

  //when pagnation is turned off, skip all of the pagination checks
  if (checkStatus != 'off') {
    //for our case, pagination should only be considered for paths without a path parameter and should apply for get responses for the mean time
    for (const head in resolvedSpec.paths) {
      if (/}$/.test(head)) {
        continue;
      }
      //loop through the response and check if there is an array on the top level in properties as that is a requirement for pagination
      if (resolvedSpec.paths[head].get) {
        for (const resp in resolvedSpec.paths[head].get.responses) {
          const content = resolvedSpec.paths[head].get.responses[resp].content;
          if (content && content['application/json']) {
            const jsonContent = content['application/json'];
            let arrayOnTop = false;
            if (
              (jsonContent.schema && jsonContent.schema.properties) ||
              (jsonContent.schema.pagination &&
                jsonContent.schema.pagination.properties)
            ) {
              for (const prop in jsonContent.schema.properties) {
                if (jsonContent.schema.properties[prop].type === 'array') {
                  arrayOnTop = true;
                  break;
                }
              }
              // this an array that contains all of the query parameters
              const queryParameters = resolvedSpec.paths[
                head
              ].get.parameters.map(parameter => parameter.name);

              // a paginated spec should have one of the following as query parameters
              if (
                arrayOnTop &&
                !jsonContent.schema.pagination &&
                (queryParameters.includes('limit') ||
                  queryParameters.includes('start') ||
                  queryParameters.includes('cursor') ||
                  queryParameters.includes('token') ||
                  queryParameters.includes('offset'))
              ) {
                const obj = jsonContent.schema;
                // loop through parameters and make sure that the pagination related parameters follow the correct defintions
                if (resolvedSpec.paths[head].get.parameters.length > 0) {
                  for (
                    let i = 0;
                    i < resolvedSpec.paths[head].get.parameters.length;
                    i++
                  ) {
                    if (
                      resolvedSpec.paths[head].get.parameters[i].name ===
                        'limit' &&
                      (resolvedSpec.paths[head].get.parameters[i].schema
                        .type !== 'integer' ||
                        resolvedSpec.paths[head].get.parameters[i].schema
                          .required === true ||
                        (!resolvedSpec.paths[head].get.parameters[i].default &&
                          !resolvedSpec.paths[head].get.parameters[i].maximum))
                    ) {
                      const path = [
                        'paths',
                        head,
                        'get',
                        'parameters',
                        i,
                        'name'
                      ];
                      const message =
                        'limit must be of type integer and must be optional with default and maximum values';
                      paginationWarning(message, path);
                    }
                    if (
                      (resolvedSpec.paths[head].get.parameters[i].name ===
                        'start' ||
                        resolvedSpec.paths[head].get.parameters[i].name ===
                          'cursor') &&
                      (resolvedSpec.paths[head].get.parameters[i].schema
                        .type !== 'integer' ||
                        resolvedSpec.paths[head].get.parameters[i].required ==
                          true)
                    ) {
                      const message =
                        'the start or cursor properties must be integers and optional';
                      paginationWarning(message, path);
                    }
                  }
                }
                if (
                  !queryParameters.includes('start') &&
                  !queryParameters.includes('offset')
                ) {
                  const path = ['paths', head, 'get', 'parameters'];
                  const message =
                    'if start is not defined then offset must be defined and must be of type integer and optional';
                  paginationWarning(message, path);
                }
                const path = [
                  'paths',
                  head,
                  'get',
                  'responses',
                  resp,
                  'content',
                  'application/json',
                  'schema',
                  'properties',
                  'name'
                ];
                nextChecker(obj, path);
                queryLimitChecker(obj, path, queryParameters);
                queryOffsetChecker(obj, path, queryParameters);
                totalCountChecker(obj, path);
                nextTokenChecker(obj, path, queryParameters);
              } else if (jsonContent.schema.pagination) {
                const obj = jsonContent.schema.pagination;
                const path = [
                  'paths',
                  head,
                  'get',
                  'reponses',
                  resp,
                  'content',
                  'application/json',
                  'pagination',
                  'schema',
                  'properties',
                  'name'
                ];
                nextChecker(obj, path);
                queryLimitChecker(obj, path, queryParameters);
                queryOffsetChecker(obj, path, queryParameters);
                totalCountChecker(obj, path);
                nextTokenChecker(obj, path, queryParameters);
              }
            }
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
  function queryOffsetChecker(obj, path, queryParameters) {
    if (
      queryParameters.includes('offset') &&
      (!obj.properties.offset ||
        obj.properties.offset.type !== 'integer' ||
        !obj.required.includes('offset'))
    ) {
      const message =
        'if a offset exists as a parameter query it must be defined as a property';
      paginationWarning(message, path);
    }
  }

  // this function checks the `limit` property in responses
  function queryLimitChecker(obj, path, queryParameters) {
    if (
      queryParameters.includes('limit') &&
      (!obj.properties.limit ||
        obj.properties.limit.type !== 'integer' ||
        !obj.required.includes('limit'))
    ) {
      const message =
        'if a limit exists as a parameter query it must be defined as a property';
      paginationWarning(message, path);
    }
  }
  // this function checks the `next_token` and `next_cursor` properties in responses
  function nextTokenChecker(obj, path, queryParameters) {
    if (
      (queryParameters.includes('start') ||
        queryParameters.includes('token') ||
        queryParameters.includes('cursor')) &&
      (!obj.properties.next_token && !obj.properties.next_cursor)
    ) {
      const message =
        'if start or token or cursor are  defined then responses must have a `next_token` or `next_cursor` property';
      paginationWarning(message, path);
    }
  }

  // this function checks the `total_count` property in responses
  function totalCountChecker(obj, path) {
    if (
      obj.properties.total_count &&
      obj.properties.total_count.type != 'integer'
    ) {
      const message = 'if total_count is defined, it must be of type integer';
      paginationWarning(message, path);
    }
  }

  // this function makes sure that there is a `next_url` property
  function nextChecker(obj, path) {
    if (!obj.properties.next_url) {
      const message =
        'a paginated success response must contain the next property';
      paginationWarning(message, path);
    }
  }
  return { errors: result.error, warnings: result.warning };
};
