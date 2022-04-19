// Assertation 1:
// The Responses Object MUST contain at least one response code
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#responsesObject
// [Removed]

// Assertation 2:
// At least one response "SHOULD be the response for a successful operation call"
// [Removed]

// Assertation 3:
// A 204 response MUST not define a response body
// https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.5
// [Removed]

// Assertation 4:
// A non-204 success response should define a response body
// [Removed]

// Assertation 5. Response bodies with application/json content should not use schema
// type: string, format: binary.

const { walk, isResponseObject } = require('../../../utils');
const MessageCarrier = require('../../../utils/message-carrier');
const {
  findOctetSequencePaths
} = require('../../../utils/find-octet-sequence-paths');

module.exports.validate = function({ resolvedSpec }, config) {
  const messages = new MessageCarrier();

  const configSchemas = config.schemas;

  walk(resolvedSpec, [], function(obj, path) {
    // because we are using the resolved spec here,
    // and only want to validate the responses inside of operations,
    // check that we are within the `paths` object
    if (isResponseObject(path) && path[0] === 'paths') {
      const binaryStringStatus = configSchemas.json_or_param_binary_string;
      if (binaryStringStatus !== 'off') {
        validateNoBinaryStringsInResponse(
          obj,
          messages,
          path,
          binaryStringStatus
        );
      }
    }
  });

  return messages;
};

function validateNoBinaryStringsInResponse(
  responseObj,
  messages,
  path,
  binaryStringStatus
) {
  Object.keys(responseObj).forEach(function(responseCode) {
    const responseBodyContent = responseObj[responseCode].content;
    if (responseBodyContent) {
      Object.keys(responseBodyContent).forEach(function(mimeType) {
        if (mimeType === 'application/json') {
          const schemaPath = path.concat([
            responseCode,
            'content',
            mimeType,
            'schema'
          ]);
          const octetSequencePaths = findOctetSequencePaths(
            responseBodyContent[mimeType].schema,
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
      });
    }
  });
}
