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
    console.log(obj);
    const listX = ['limit','offset','start', 'token', 'aliases'];
    // if(obj.required){
    //   console.log(obj.required.includes('hi'));
    // }
    for(topLevelProp in obj){
      if (Array.isArray(topLevelProp && (obj.pagination || obj.limit || obj.start || obj.offset))){
        if(!obj.next || !obj.required.includes('next') || !obj.pagination.next_url){
          const message = 'a paginated success response must contain the next property';
          const checkStatus = config.pagination;
          if (checkStatus !== 'off') {
            result[checkStatus].push({
              path,
              message
            });
          }
        }

        if(obj.pagination){
          for(url in obj.pagination){
            if((url.contains('limit') && (!obj.limit || typeof obj.limit !== 'integer' || !obj.required.contains('limit'))) ||
             (url.contains('offset') && (!obj.offset || typeof obj.offset !== 'integer' || !obj.pagination.required.contains('offset'))))
             {
              const message = 'if limit or offset parameters exist as a parameter query, then they must be defined as properties';
              const checkStatus = config.pagination;
              if (checkStatus !== 'off') {
                result[checkStatus].push({
                  path,
                  message
              });
            }
            }

        }
      } else{
        for(url in obj){
          if(url.contains('limit') && (!obj.limit || typeof obj.limit !== 'integer' )){
            const message = 'if a limit exists as a parameter query it must be defined as a property';
            const checkStatus = config.pagination;
            if (checkStatus !== 'off') {
              result[checkStatus].push({
                path,
                message
            });
          }
          }
        }
        

          if(url.contains('offset') && (!obj.offset || typeof obj.offset !== 'integer' )){
            const message = 'if a offset exists as a parameter query it must be defined as a property';
            const checkStatus = config.pagination;
            if (checkStatus !== 'off') {
              result[checkStatus].push({
                path,
                message
            });
          }
          }

          if(
            (
            url.contains('start') ||
            url.contains('cursor') ||
            url.contains('token')) &&
            (
              !obj.start ||
              !obj.cursor ||
              !obj.token
            ) ||
              (
                typeof obj.start !== 'string' ||
                typeof obj.cursor !== 'string'||
                typeof obj.token !== 'string'
            )) {
            const message = 'if a start, cursor, or token exist as a parameter query then they should also be defined as string types';
            const checkStatus = config.pagination;
            if (checkStatus !== 'off') {
              result[checkStatus].push({
                path,
                message
            });
          }
          }
        }

        if((obj.total_count && typeof obj.total_count !== 'integer') ||
           (obj.pagination.total && obj.pagination.total !== 'integer'))
           {
          const message = 'total_count must be of type integer';
          const checkStatus = config.pagination;
          if (checkStatus !== 'off') {
            result[checkStatus].push({
              path,
              message
            });
          }
        }
      }
    }
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
