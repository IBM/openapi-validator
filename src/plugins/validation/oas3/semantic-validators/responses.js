// Assertation 1:
// The Responses Object MUST contain at least one response code
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#responsesObject

// Assertation 2:
// At least one response "SHOULD be the response for a successful operation call"

// Assertation 3:
// A 204 response MUST not define a response body
// https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.5

// Assertation 4:
// A non-204 success response should define a response body

// Assertation 5. Response bodies with application/json content should not use schema
// type: string, format: binary.

const { walk } = require('../../../utils');
const MessageCarrier = require('../../../utils/messageCarrier');
const findOctetSequencePaths = require('../../../utils/findOctetSequencePaths')
  .findOctetSequencePaths;

module.exports.validate = function({ resolvedSpec }, config) {
  const messages = new MessageCarrier();

  const configSchemas = config.schemas;
  config = config.responses;

  walk(resolvedSpec, [], function(obj, path) {
    const contentsOfResponsesObject =
      path[0] === 'paths' && path[path.length - 1] === 'responses';

    if (contentsOfResponsesObject) {
      const [statusCodes, successCodes] = getResponseCodes(obj);

      const binaryStringStatus = configSchemas.json_or_param_binary_string;
      if (binaryStringStatus !== 'off') {
        validateNoBinaryStringsInResponse(
          obj,
          messages,
          path,
          binaryStringStatus
        );
      }

      if (!statusCodes.length) {
        messages.addMessage(
          path,
          'Each `responses` object MUST have at least one response code.',
          config.no_response_codes
        );
      } else if (!successCodes.length) {
        messages.addMessage(
          path,
          'Each `responses` object SHOULD have at least one code for a successful response.',
          config.no_success_response_codes
        );
      } else {
        // validate success codes
        for (const successCode of successCodes) {
          if (successCode !== '204' && !obj[successCode].content) {
            messages.addMessage(
              path.concat([successCode]),
              `A ${successCode} response should include a response body. Use 204 for responses without content.`,
              config.no_response_body
            );
          } else if (successCode === '204' && obj[successCode].content) {
            messages.addMessage(
              path.concat(['204', 'content']),
              `A 204 response MUST NOT include a message-body.`,
              'error'
            );
          }
        }
      }
    }
  });

  return messages;
};

function getResponseCodes(responseObj) {
  const statusCodes = Object.keys(responseObj).filter(code =>
    isStatusCode(code)
  );
  const successCodes = statusCodes.filter(code => code.slice(0, 1) === '2');
  return [statusCodes, successCodes];
}

function isStatusCode(code) {
  const allowedFirstDigits = ['1', '2', '3', '4', '5'];
  return code.length === 3 && allowedFirstDigits.includes(code.slice(0, 1));
}

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
              binaryStringStatus
            );
          }
        }
      });
    }
  });
}
