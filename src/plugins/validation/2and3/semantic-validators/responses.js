const each = require('lodash/each');
const walk = require('../../../utils/walk');

const isUrl = require('is-url');

const INLINE_SCHEMA_MESSAGE =
  'Response schemas should be defined with a named ref.';

module.exports.validate = function({ jsSpec, isOAS3 }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.responses;
  walk(jsSpec, [], function(obj, path) {
    const contentsOfResponsesObject = path[path.length - 1] === 'responses';
    const isGetResponse = path[path.length - 2] === 'get';
    const isRef = !!obj.$ref;
    if (contentsOfResponsesObject && !isRef) {
      each(obj, (response, responseKey) => {
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
                    typeof response.content[mediaTypeKey].schema.limit !==
                      'number'))
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
                    typeof response.content[mediaTypeKey].schema.offset !==
                      'number'))
              ) {
                const message =
                  'if a offset exists as a parameter query it must be defined as a property';
                paginatioWarning(message);
              }
              if (
                (/start/.test(response.content[mediaTypeKey].schema[url]) ||
                  /token/.test(response.content[mediaTypeKey].schema[url]) ||
                  /cursor/.test(response.content[mediaTypeKey].schema[url])) &&
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
                typeof response.content[mediaTypeKey].schema.total_count !==
                  'number'
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
            for (const url in response.content[mediaTypeKey].schema.pagination) {
              if (
                (/limit/.test(
                  response.content[mediaTypeKey].schema.pagination[url]
                ) &&
                  (!response.content[mediaTypeKey].schema.pagination.limit ||
                    typeof response.content[mediaTypeKey].schema.pagination.limit !== 'number' ||
                    !response.content[
                      mediaTypeKey
                    ].schema.pagination.required.includes('limit'))) ||
                (/offset/.test(
                  response.content[mediaTypeKey].schema.pagination[url]
                ) &&
                  (!response.content[mediaTypeKey].schema.pagination.offset ||
                    typeof response.content[mediaTypeKey].schema.pagination.offset !== 'number' ||
                    !response.content[
                      mediaTypeKey
                    ].schema.pagination.required.includes('offset')))
              ) {
                const message = 'if limit or offset parameters exist as a parameter query, then they must be defined as properties';
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
                  !response.content[mediaTypeKey].schema.pagination.next_token ||
                  !response.content[mediaTypeKey].schema.pagination.next.cursor ||
                  !response.content[mediaTypeKey].schema.pagination.next_cursor)
              ) {
                const message =
                  'if a start, cursor, or token exist as a parameter query then `next.token` or `next_token` or `next.cursor` or `next_cursor` must be defined';
                paginatioWarning(message);
              }
              if (
                response.content[mediaTypeKey].schema.pagination.total_count &&
                typeof response.content[mediaTypeKey].schema.pagination.total_count !== 'number'
              ) {
                const message = 'total_count must be of type integer';
                paginatioWarning(message);
                break;
              }
            }
          }
        });
        if (isOAS3) {
          each(response.content, (mediaType, mediaTypeKey) => {
            const combinedSchemaTypes = ['allOf', 'oneOf', 'anyOf'];
            if (
              mediaType.schema &&
              mediaTypeKey.startsWith('application/json')
            ) {
              const hasCombinedSchema =
                mediaType.schema.allOf ||
                mediaType.schema.anyOf ||
                mediaType.schema.oneOf;

              if (hasCombinedSchema) {
                combinedSchemaTypes.forEach(schemaType => {
                  if (mediaType.schema[schemaType]) {
                    for (
                      let i = 0;
                      i < mediaType.schema[schemaType].length;
                      i++
                    ) {
                      const hasInlineSchema = !mediaType.schema[schemaType][i]
                        .$ref;
                      if (hasInlineSchema) {
                        const checkStatus = config.inline_response_schema;
                        if (checkStatus !== 'off') {
                          result[checkStatus].push({
                            path: [
                              ...path,
                              responseKey,
                              'content',
                              mediaTypeKey,
                              'schema',
                              schemaType,
                              i
                            ],
                            message: INLINE_SCHEMA_MESSAGE
                          });
                        }
                      }
                    }
                  }
                });
              } else if (!mediaType.schema.$ref) {
                const checkStatus = config.inline_response_schema;
                if (checkStatus !== 'off') {
                  result[checkStatus].push({
                    path: [
                      ...path,
                      responseKey,
                      'content',
                      mediaTypeKey,
                      'schema'
                    ],
                    message: INLINE_SCHEMA_MESSAGE
                  });
                }
              }
            }
          });
        } else {
          // oas 2 allows extensions for responses, dont validate inside of these
          if (responseKey.startsWith('x-')) return;

          const hasInlineSchema = response.schema && !response.schema.$ref;
          if (hasInlineSchema) {
            const checkStatus = config.inline_response_schema;
            if (checkStatus !== 'off') {
              result[checkStatus].push({
                path: [...path, responseKey, 'schema'],
                message: INLINE_SCHEMA_MESSAGE
              });
            }
          }
        }
      });
    }
    function paginatioWarning(message) {
      const checkStatus = config.pagination;
      if (checkStatus !== 'off') {
        result[checkStatus].push({
          path,
          message
        });
      }
    }
  });
  return { errors: result.error, warnings: result.warning };
};
