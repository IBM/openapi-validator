module.exports.validate = function({ jsSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.pagination;
  const queryParameters = [];
  for (const head in jsSpec.paths) {
    if (/{/.test(head)) {
      continue;
    }
    if (jsSpec.paths[head].get) {
      for (const resp in jsSpec.paths[head].get.responses) {
        for (const con in jsSpec.paths[head].get.responses[resp].content) {
          if (con == 'application/json') {
            let arrayOnTop = false;
            if (
              (jsSpec.paths[head].get.responses[resp].content[con].schema &&
                jsSpec.paths[head].get.responses[resp].content[con].schema
                  .properties) ||
              (jsSpec.paths[head].get.responses[resp].content[con].schema
                .pagination &&
                jsSpec.paths[head].get.responses[resp].content[con].schema
                  .pagination.properties)
            ) {
              for (const prop in jsSpec.paths[head].get.responses[resp].content[
                con
              ].schema.properties) {
                if (
                  jsSpec.paths[head].get.responses[resp].content[con].schema
                    .properties[prop].type == 'array'
                ) {
                  arrayOnTop = true;
                  break;
                }
              }
              for (
                let k = 0;
                k < jsSpec.paths[head].get.parameters.length;
                k++
              ) {
                queryParameters.push(jsSpec.paths[head].get.parameters[k].name);
              }

              if (
                arrayOnTop &&
                !jsSpec.paths[head].get.responses[resp].content[con].schema
                  .pagination &&
                (queryParameters.includes('limit') ||
                  queryParameters.includes('start') ||
                  queryParameters.includes('cursor') ||
                  queryParameters.includes('token') ||
                  queryParameters.includes('offset'))
              ) {
                const obj =
                  jsSpec.paths[head].get.responses[resp].content[con].schema;
                for (
                  let i = 0;
                  i < jsSpec.paths[head].get.parameters.length;
                  i++
                ) {
                  if (
                    jsSpec.paths[head].get.parameters[i].name == 'limit' &&
                    (jsSpec.paths[head].get.parameters[i].schema.type !==
                      'integer' ||
                      !jsSpec.paths[head].get.parameters[i].default ||
                      !jsSpec.paths[head].get.parameters[i].maximum)
                  ) {
                    const message =
                      'limit must be of type integer and must be optional with default and maximum values';
                    paginationWarning(message);
                  }
                  if (
                    (jsSpec.paths[head].get.parameters[i].name == 'start' ||
                      jsSpec.paths[head].get.parameters[i].name == 'cursor') &&
                    (jsSpec.paths[head].get.parameters[i].schema.type !==
                      'integer' ||
                      jsSpec.paths[head].get.parameters[i].required == true)
                  ) {
                    const message =
                      'the start or cursor properties must be integers and optional';
                    paginationWarning(message);
                  }
                }
                if (
                  !queryParameters.includes('start') &&
                  !queryParameters.includes('offset')
                ) {
                  const message =
                    'if start is not defined then offset must be defined and must be of type integer and optional';
                  paginationWarning(message);
                }
                nextChecker(obj);
                queryLimitChecker(obj);
                queryOffsetChecker(obj);
                totalCountChecker(obj);
                nextTokenChecker(obj);
              } else if (
                jsSpec.paths[head].get.responses[resp].content[con].schema
                  .pagination
              ) {
                const obj =
                  jsSpec.paths[head].get.responses[resp].content[con].schema
                    .pagination;
                nextChecker(obj);
                queryLimitChecker(obj);
                queryOffsetChecker(obj);
                totalCountChecker(obj);
                nextTokenChecker(obj);
              }
            }
          }
        }
      }
    }
  }
  function paginationWarning(message) {
    const checkStatus = config.pagination_style;
    result[checkStatus].push({
      message
    });
  }

  function queryOffsetChecker(obj, message) {
    if (
      queryParameters.includes('offset') &&
      (!obj.properties.offset ||
        obj.properties.offset.type !== 'integer' ||
        !obj.required.includes('offset'))
    ) {
      message =
        'if a offset exists as a parameter query it must be defined as a property';
      paginationWarning(message);
    }
  }

  function queryLimitChecker(obj, message) {
    if (
      queryParameters.includes('limit') &&
      (!obj.properties.limit ||
        obj.properties.limit.type !== 'integer' ||
        !obj.required.includes('limit'))
    ) {
      message =
        'if a limit exists as a parameter query it must be defined as a property';
      paginationWarning(message);
    }
  }

  function nextTokenChecker(obj) {
    if (
      (queryParameters.includes('start') ||
        queryParameters.includes('token') ||
        queryParameters.includes('cursor')) &&
      (!obj.properties.next_token && !obj.properties.next_cursor)
    ) {
      const message =
        'if start or token or cursor are  defined then responses must have a `next_token` or `next_cursor` property';
      paginationWarning(message);
    }
  }

  function totalCountChecker(obj) {
    if (
      obj.properties.total_count &&
      obj.properties.total_count.type != 'integer'
    ) {
      const message = 'if total_count is defined, it must be of type integer';
      paginationWarning(message);
    }
  }

  function nextChecker(obj) {
    if (!obj.properties.next_url) {
      const message =
        'a paginated success response must contain the next property';
      paginationWarning(message);
    }
  }
  return { errors: result.error, warnings: result.warning };
};
