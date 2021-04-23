// Assertation 1:
// "Parameters MUST have an `in` property."
// `in` is REQUIRED. Possible values are "query", "header", "path" or "cookie".

// Assertation 2:
// A parameter MUST contain either a schema property, or a content property, but not both.

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#parameterObject

// Assertation 3:
// A paramater should not use schema type: string, format: binary because there is now well-
// defined way to encode an octet sequence in a URL.

const { isParameterObject, walk } = require('../../../utils');
const MessageCarrier = require('../../../utils/messageCarrier');
const findOctetSequencePaths = require('../../../utils/findOctetSequencePaths')
  .findOctetSequencePaths;

module.exports.validate = function({ jsSpec }, config) {
  const messages = new MessageCarrier();

  const configSchemas = config.schemas;
  config = config.parameters;

  walk(jsSpec, [], function(obj, path) {
    const isContentsOfParameterObject = isParameterObject(path, true); // 2nd arg is isOAS3
    const isRef = !!obj.$ref;

    // obj is a parameter object
    if (isContentsOfParameterObject && !isRef) {
      const binaryStringStatus = configSchemas.json_or_param_binary_string;
      if (binaryStringStatus !== 'off') {
        const octetSequencePaths = [];
        octetSequencePaths.push(
          ...findOctetSequencePaths(obj.schema, path.concat(['schema']))
        );
        if (obj.content) {
          Object.keys(obj.content).forEach(function(mimeType) {
            if (mimeType === 'application/json') {
              const paramContentPath = path.concat([
                'content',
                mimeType,
                'schema'
              ]);
              octetSequencePaths.push(
                ...findOctetSequencePaths(
                  obj.content[mimeType].schema,
                  paramContentPath
                )
              );
            }
          });
        }

        for (const p of octetSequencePaths) {
          messages.addMessage(
            p,
            'Parameters should not contain binary (type: string, format: binary) values.',
            binaryStringStatus,
            'json_or_param_binary_string'
          );
        }
      }
    }
  });
  return messages;
};
