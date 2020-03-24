const each = require('lodash/each');
const { walk } = require('../../../utils');
const MessageCarrier = require('../../../utils/messageCarrier');

const INLINE_SCHEMA_MESSAGE =
  'Response schemas should be defined with a named ref.';

module.exports.validate = function({ jsSpec, isOAS3 }, config) {
  const messages = new MessageCarrier();

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
                      const arrItemsIsRef =
                        mediaType.schema[schemaType][i].items &&
                        mediaType.schema[schemaType][i].items.$ref;

                      if (hasInlineSchema && !arrItemsIsRef) {
                        messages.addMessage(
                          [
                            ...path,
                            responseKey,
                            'content',
                            mediaTypeKey,
                            'schema',
                            schemaType,
                            i
                          ],
                          INLINE_SCHEMA_MESSAGE,
                          config.inline_response_schema
                        );
                      }
                    }
                  }
                });
              } else if (
                !mediaType.schema.$ref &&
                !(mediaType.schema.items && mediaType.schema.items.$ref)
              ) {
                messages.addMessage(
                  [...path, responseKey, 'content', mediaTypeKey, 'schema'],
                  INLINE_SCHEMA_MESSAGE,
                  config.inline_response_schema
                );
              }
            }
          });
        } else {
          // oas 2 allows extensions for responses, dont validate inside of these
          if (responseKey.startsWith('x-')) return;

          const hasInlineSchema = response.schema && !response.schema.$ref;
          const arrItemsIsRef =
            response.schema &&
            response.schema.items &&
            response.schema.items.$ref;
          if (hasInlineSchema && !arrItemsIsRef) {
            messages.addMessage(
              [...path, responseKey, 'schema'],
              INLINE_SCHEMA_MESSAGE,
              config.inline_response_schema
            );
          }
        }
      });
    }
  });

  return messages;
};
