// Assertation 1:
// The Responses Object MUST contain at least one response code
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#responsesObject

// Assertation 2:
// At least one response "SHOULD be the response for a successful operation call"

// Assertation 3:
// A 204 response MUST not define a response body
// https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.5

// Assertation 4:
// A non-204 success response MUST define a response body

const { walk } = require('../../../utils');

module.exports.validate = function({ jsSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.responses;

  walk(jsSpec, [], function(obj, path) {
    const contentsOfResponsesObject =
      path[0] === 'paths' && path[path.length - 1] === 'responses';
    const isRef = !!obj.$ref;

    if (contentsOfResponsesObject && !isRef) {
      if (obj['204'] && obj['204'].content) {
        result.error.push({
          path: path.concat(['204', 'content']),
          message: `A 204 response MUST NOT include a message-body.`
        });
      }
      const responseCodes = Object.keys(obj).filter(code =>
        isResponseCode(code)
      );
      if (!responseCodes.length) {
        const message =
          'Each `responses` object MUST have at least one response code.';
        const checkStatus = config.no_response_codes;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path,
            message
          });
        }
      } else {
        const successCodes = responseCodes.filter(
          code => code.slice(0, 1) === '2'
        );
        if (!successCodes.length) {
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
          const checkStatus = config.no_response_body;
          // if response body rule is on, loops through success codes and issues warning (by default)
          // for non-204 success responses without a response body
          if (checkStatus !== 'off') {
            for (const successCode of successCodes) {
              if (successCode != '204' && !obj[successCode].content) {
                result[checkStatus].push({
                  path: path.concat([successCode]),
                  message:
                    `A ` +
                    successCode +
                    ` response should include a response body. Use 204 for responses without content.`
                });
              }
            }
          }
        }
      }
    }
  });

  return { errors: result.error, warnings: result.warning };
};

function isResponseCode(code) {
  const allowedFirstDigits = ['1', '2', '3', '4', '5'];
  return code.length === 3 && allowedFirstDigits.includes(code.slice(0, 1));
}
