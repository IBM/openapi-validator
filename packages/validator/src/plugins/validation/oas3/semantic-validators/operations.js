// Assertation 1. Request body objects must have a `content` property
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#requestBodyObject
// covered by Spectral's oas3-schema rule

// Assertation 2. Request bodies with application/json content should not use schema
// type: string, format: binary.

const pick = require('lodash/pick');
const each = require('lodash/each');
const MessageCarrier = require('../../../utils/message-carrier');
const findOctetSequencePaths = require('../../../utils/find-octet-sequence-paths')
  .findOctetSequencePaths;

module.exports.validate = function({ resolvedSpec }, config) {
  const messages = new MessageCarrier();

  const configSchemas = config.schemas;
  config = config.operations;

  // get, head, and delete are not in this list because they are not allowed
  // to have request bodies
  const allowedOps = ['post', 'put', 'patch', 'options', 'trace'];

  each(resolvedSpec.paths, (path, pathName) => {
    const operations = pick(path, allowedOps);
    each(operations, (op, opName) => {
      if (!op || op['x-sdk-exclude'] === true) {
        return;
      }
      if (op.requestBody) {
        const requestBodyContent = op.requestBody.content;
        const requestBodyMimeTypes =
          op.requestBody.content && Object.keys(requestBodyContent);
        if (requestBodyContent && requestBodyMimeTypes.length) {
          // request body has content

          // Assertation 2
          const binaryStringStatus = configSchemas.json_or_param_binary_string;
          if (binaryStringStatus !== 'off') {
            for (const mimeType of requestBodyMimeTypes) {
              if (mimeType === 'application/json') {
                const schemaPath = `paths.${pathName}.${opName}.requestBody.content.${mimeType}.schema`;
                const octetSequencePaths = findOctetSequencePaths(
                  requestBodyContent[mimeType].schema,
                  schemaPath
                );
                for (const p of octetSequencePaths) {
                  messages.addMessage(
                    p,
                    'JSON request/response bodies should not contain binary (type: string, format: binary) values.',
                    binaryStringStatus,
                    'json_or_param_binary_string'
                  );
                }
              }
            }
          }
        }
      }
    });
  });

  return messages;
};
