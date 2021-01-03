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

const { walk, isResponseObject } = require('../../../utils');
const MessageCarrier = require('../../../utils/messageCarrier');
const findOctetSequencePaths = require('../../../utils/findOctetSequencePaths')
  .findOctetSequencePaths;

module.exports.validate = function({ resolvedSpec }, config) {
  const messages = new MessageCarrier();

  const configSchemas = config.schemas;
  config = config.responses;

  walk(resolvedSpec, [], function(obj, path) {
    // because we are using the resolved spec here,
    // and only want to validate the responses inside of operations,
    // check that we are within the `paths` object
    if (isResponseObject(path) && path[0] === 'paths') {
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
          config.no_response_codes,
          'no_response_codes'
        );
      } else {
        for (const statusCode of statusCodes) {
          if (!obj[statusCode].description) {
            messages.addMessage(
              path.concat([statusCode]),
              `All responses must include a description.`,
              'error'
            );
          }
          // default warnings for discouraged status code per IBM API Handbook
          if (statusCode === '422') {
            messages.addMessage(
              path.concat(['422']),
              'Should use status code 400 instead of 422 for invalid request payloads.',
              config.ibm_status_code_guidelines,
              'ibm_status_code_guidelines'
            );
          } else if (statusCode === '302') {
            messages.addMessage(
              path.concat(['302']),
              'Should use status codes 303 or 307 instead of 302.',
              config.ibm_status_code_guidelines,
              'ibm_status_code_guidelines'
            );
          }
        }
        // validate all success codes
        if (!successCodes.length) {
          messages.addMessage(
            path,
            'Each `responses` object SHOULD have at least one code for a successful response.',
            config.no_success_response_codes,
            'no_success_response_codes'
          );
        } else {
          for (const statusCode of successCodes) {
            if (statusCode !== '204' && !obj[statusCode].content) {
              messages.addMessage(
                path.concat([statusCode]),
                `A ${statusCode} response should include a response body. Use 204 for responses without content.`,
                config.no_response_body,
                'no_response_body'
              );
            } else if (statusCode === '204' && obj[statusCode].content) {
              messages.addMessage(
                path.concat(['204', 'content']),
                `A 204 response MUST NOT include a message-body.`,
                'error'
              );
            }
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
              binaryStringStatus,
              'json_or_param_binary_string'
            );
          }
        }
      });
    }
  });
}
