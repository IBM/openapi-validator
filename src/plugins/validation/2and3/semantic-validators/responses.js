const each = require('lodash/each');

const INLINE_SCHEMA_MESSAGE =
  'Response schemas should be defined with a named ref.';

module.exports.validate = function({ jsSpec, isOAS3 }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.responses;

  function walk(obj, path) {
    if (typeof obj !== 'object' || obj === null) {
      return;
    }

    // don't walk down examples or extensions
    const current = path[path.length - 1];
    if (
      current === 'example' ||
      current === 'examples' ||
      (current && current.slice(0, 2) === 'x-')
    ) {
      return;
    }

    const contentsOfResponsesObject = path[path.length - 1] === 'responses';
    const isRef = !!obj.$ref;

    if (contentsOfResponsesObject && !isRef) {
      each(obj, (response, responseKey) => {
        if (isOAS3) {
          each(response.content, (mediaType, mediaTypeKey) => {
            const hasInlineSchema = mediaType.schema && !mediaType.schema.$ref;
            if (hasInlineSchema) {
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

    if (Object.keys(obj).length) {
      return Object.keys(obj).map(k => {
        return walk(obj[k], [...path, k]);
      });
    } else {
      return null;
    }
  }

  walk(jsSpec, []);
  return { errors: result.error, warnings: result.warning };
};
