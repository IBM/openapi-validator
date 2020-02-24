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
      const allowedInValues = ['query', 'header', 'path', 'cookie'];
      if (!obj.in) {
        // bad because in is required
        messages.addMessage(
          path,
          'Parameters MUST have an `in` property.',
          config.no_in_property,
          'no_in_property'
        );
      } else if (!allowedInValues.includes(obj.in)) {
        // bad because `in` must be one of a few values
        messages.addMessage(
          path.concat('in'),
          `Unsupported value for \`in\`: '${
            obj.in
          }'. Allowed values are ${allowedInValues.join(', ')}`,
          config.invalid_in_property,
          'invalid_in_property'
        );
      }

      if (!obj.schema && !obj.content) {
        // bad because at least one is needed
        messages.addMessage(
          path,
          'Parameters MUST have their data described by either `schema` or `content`.',
          config.missing_schema_or_content,
          'missing_schema_or_content'
        );
      } else if (obj.schema && obj.content) {
        // bad because only one is allowed to be used at a time
        messages.addMessage(
          path,
          'Parameters MUST NOT have both a `schema` and `content` property.',
          config.has_schema_and_content,
          'has_schema_and_content'
        );
      }

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
