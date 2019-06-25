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
            if (mediaType && mediaType.schema && mediaType.schema.oneOf) {
              for (let i = 0; i < mediaType.schema.oneOf.length; i++) {
                const hasInlineSchema =
                  mediaType.schema &&
                  mediaType.schema.oneOf &&
                  !Object.keys(mediaType.schema.oneOf[i]).includes('$ref');
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
                        'oneOf'
                      ],
                      message: INLINE_SCHEMA_MESSAGE
                    });
                  }
                }
              }
            } else if (
              mediaType &&
              mediaType.schema &&
              mediaType.schema.allOf
            ) {
              for (let i = 0; i < mediaType.schema.allOf.length; i++) {
                const hasInlineSchema =
                  mediaType.schema &&
                  mediaType.schema.allOf &&
                  !Object.keys(mediaType.schema.allOf[i]).includes('$ref');
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
                        'allOf'
                      ],
                      message: INLINE_SCHEMA_MESSAGE
                    });
                  }
                }
              }
            } else if (
              mediaType &&
              mediaType.schema &&
              mediaType.schema.anyOf
            ) {
              for (let i = 0; i < mediaType.schema.anyOf.length; i++) {
                const hasInlineSchema =
                  mediaType.schema &&
                  mediaType.schema.anyOf &&
                  !Object.keys(mediaType.schema.anyOf[i]).includes('$ref');
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
                        'anyOf'
                      ],
                      message: INLINE_SCHEMA_MESSAGE
                    });
                  }
                }
              }
            } else if (
              mediaType.schema &&
              !mediaType.schema.$ref &&
              mediaTypeKey.startsWith('application/json')
            ) {
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
