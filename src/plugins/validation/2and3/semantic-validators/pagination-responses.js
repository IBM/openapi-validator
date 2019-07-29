const each = require('lodash/each');
const walk = require('../../../utils/walk');

const isUrl = require('is-url');

module.exports.validate = function({ jsSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.responses;
  walk(jsSpec, [], function(obj, path) {
    const contentsOfResponsesObject = path[path.length - 1] === 'responses';
    const isGetResponse = path[path.length - 2] === 'get';
    const isRef = !!obj.$ref;
    if (config.pagination != 'off') {
      if (contentsOfResponsesObject && !isRef) {
        each(obj, response => {
          each(response.content, (mediaType, mediaTypeKey) => {
            let arrayOnTop = false;
            for (const param in response.content[mediaTypeKey].schema) {
              if (Array.isArray(response.content[mediaTypeKey].schema[param])) {
                arrayOnTop = true;
                break;
              }
            }
            if (
              arrayOnTop &&
              isGetResponse &&
              (response.content[mediaTypeKey].schema.limit ||
                response.content[mediaTypeKey].schema.start ||
                response.content[mediaTypeKey].schema.cursor ||
                response.content[mediaTypeKey].schema.token ||
                response.content[mediaTypeKey].schema.offset) &&
              !response.content[mediaTypeKey].schema.pagination
            ) {
              if (!response.content[mediaTypeKey].schema.next) {
                const message =
                  'a paginated success response must contain the next property';
                paginatioWarning(message);
              }

              for (const url in response.content[mediaTypeKey].schema) {
                if (
                  isUrl(response.content[mediaTypeKey].schema[url]) &&
                  (/limit/.test(response.content[mediaTypeKey].schema[url]) &&
                    (!response.content[mediaTypeKey].schema.limit ||
                      !Number.isInteger(
                        response.content[mediaTypeKey].schema.limit
                      )))
                ) {
                  const message =
                    'if a limit exists as a parameter query it must be defined as a property';
                  paginatioWarning(message);
                  break;
                }
                if (
                  isUrl(response.content[mediaTypeKey].schema[url]) &&
                  (/offset/.test(response.content[mediaTypeKey].schema[url]) &&
                    (!response.content[mediaTypeKey].schema.offset ||
                      !Number.isInteger(
                        response.content[mediaTypeKey].schema.offset
                      )))
                ) {
                  const message =
                    'if a offset exists as a parameter query it must be defined as a property';
                  paginatioWarning(message);
                }
                if (
                  (/start/.test(response.content[mediaTypeKey].schema[url]) ||
                    /token/.test(response.content[mediaTypeKey].schema[url]) ||
                    /cursor/.test(
                      response.content[mediaTypeKey].schema[url]
                    )) &&
                  (!response.content[mediaTypeKey].schema.next ||
                    !response.content[mediaTypeKey].schema.next_token ||
                    !response.content[mediaTypeKey].schema.next.cursor ||
                    !response.content[mediaTypeKey].schema.next_cursor)
                ) {
                  const message =
                    'if a start, cursor, or token exist as a parameter query then `next.token` or `next_token` or `next.cursor` or `next_cursor` must be defined';
                  paginatioWarning(message);
                }
                if (
                  response.content[mediaTypeKey].schema.total_count &&
                  !Number.isInteger(
                    response.content[mediaTypeKey].schema.total_count
                  )
                ) {
                  const message = 'total_count must be of type integer';
                  paginatioWarning(message);
                  break;
                }
              }
            } else if (response.content[mediaTypeKey].schema.pagination) {
              if (!response.content[mediaTypeKey].schema.pagination.next_url) {
                const message =
                  'a paginated success response must contain the next property';
                paginatioWarning(message);
              }
              for (const url in response.content[mediaTypeKey].schema
                .pagination) {
                if (
                  (/limit/.test(
                    response.content[mediaTypeKey].schema.pagination[url]
                  ) &&
                    (!response.content[mediaTypeKey].schema.pagination.limit ||
                      !Number.isInteger(
                        response.content[mediaTypeKey].schema.pagination.limit
                      ) ||
                      !response.content[
                        mediaTypeKey
                      ].schema.pagination.required.includes('limit'))) ||
                  (/offset/.test(
                    response.content[mediaTypeKey].schema.pagination[url]
                  ) &&
                    (!response.content[mediaTypeKey].schema.pagination.offset ||
                      !Number.isInteger(
                        response.content[mediaTypeKey].schema.pagination.offset
                      ) ||
                      !response.content[
                        mediaTypeKey
                      ].schema.pagination.required.includes('offset')))
                ) {
                  const message =
                    'if limit or offset parameters exist as a parameter query, then they must be defined as properties';
                  paginatioWarning(message);
                  break;
                }

                if (
                  (/start/.test(
                    response.content[mediaTypeKey].schema.pagination[url]
                  ) ||
                    /token/.test(
                      response.content[mediaTypeKey].schema.pagination[url]
                    ) ||
                    /cursor/.test(
                      response.content[mediaTypeKey].schema.pagination[url]
                    )) &&
                  (!response.content[mediaTypeKey].schema.pagination.next ||
                    !response.content[mediaTypeKey].schema.pagination
                      .next_token ||
                    !response.content[mediaTypeKey].schema.pagination.next
                      .cursor ||
                    !response.content[mediaTypeKey].schema.pagination
                      .next_cursor)
                ) {
                  const message =
                    'if a start, cursor, or token exist as a parameter query then `next.token` or `next_token` or `next.cursor` or `next_cursor` must be defined';
                  paginatioWarning(message);
                }
                if (
                  response.content[mediaTypeKey].schema.pagination
                    .total_count &&
                  !Number.isInteger(
                    response.content[mediaTypeKey].schema.pagination.total_count
                  )
                ) {
                  const message = 'total_count must be of type integer';
                  paginatioWarning(message);
                  break;
                }
              }
            }
          });
        });
      }
    }
    function paginatioWarning(message) {
      const checkStatus = config.pagination;
      result[checkStatus].push({
        path,
        message
      });
    }
  });
  return { errors: result.error, warnings: result.warning };
};
