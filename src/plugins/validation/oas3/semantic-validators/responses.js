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
const findOctetSequencePaths = require('../../../utils/findOctetSequencePaths')
  .findOctetSequencePaths;

module.exports.validate = function({ resolvedSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

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
          result,
          path,
          binaryStringStatus
        );
      }

      if (!statusCodes.length) {
        const message =
          'Each `responses` object MUST have at least one response code.';
        const checkStatus = config.no_response_codes;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path,
            message
          });
        }
      } else if (!successCodes.length) {
        const message =
          'Each `responses` object SHOULD have at least one code for a successful response.';
        const checkStatus = config.no_success_response_codes;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path,
            message
          });
        }
      } else {
        // validate success codes
        for (const successCode of successCodes) {
          if (successCode !== '204' && !obj[successCode].content) {
            const checkStatus = config.no_response_body;
            if (checkStatus !== 'off') {
              const message = `A ${successCode} response should include a response body. Use 204 for responses without content.`;
              result[checkStatus].push({
                path: path.concat([successCode]),
                message
              });
            }
          } else if (successCode === '204' && obj[successCode].content) {
            result.error.push({
              path: path.concat(['204', 'content']),
              message: `A 204 response MUST NOT include a message-body.`
            });
          }
        }
      }
    }
  });

  return { errors: result.error, warnings: result.warning };
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
  result,
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
          const message =
            'JSON request/response bodies should not contain binary (type: string, format: binary) values.';
          for (const p of octetSequencePaths) {
            result[binaryStringStatus].push({
              path: p,
              message
            });
          }
        }
      });
    }
  });
}
