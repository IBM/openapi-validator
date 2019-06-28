const each = require('lodash/each');
const walk = require('../../../utils/walk');

const INLINE_SCHEMA_MESSAGE =
  'Response schemas should be defined with a named ref.';

module.exports.validate = function({ jsSpec, isOAS3 }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.responses;

  walk(jsSpec, [], function(obj, path) {
    const contentsOfResponsesObject = path[path.length - 1] === 'responses';
    const isRef = !!obj.$ref;

    if (contentsOfResponsesObject && !isRef) {
      each(obj, (response, responseKey) => {
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
  });

  return { errors: result.error, warnings: result.warning };
};
