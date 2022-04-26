/**
 * This function performs a few checks on each operation's responses field:
 * 1. Status code 400 should be used instead of 422.
 * 2. Status code 303 or 307 should be used instead of 302.
 * 3. Operation responses should include at least one successful (2xx) status code.
 * 4. Operation responses should not include status code 101 when successful (2xx) status codes are present.
 * 5. A 204 response must not have content.
 * @param {*} operation an operation within the API definition
 * @param {*} options unused, but needed as a placeholder due to the rule calling conventions
 * @param {*} path the array of path segments indicating the "location" of the operation within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function responseStatusCodes(operation, options, { path }) {
  if (!operation.responses) {
    return [];
  }

  const [statusCodes, successCodes] = getResponseCodes(operation.responses);

  if (statusCodes.length) {
    const errors = [];

    // 1. Check for a 422.
    if (statusCodes.includes('422')) {
      errors.push({
        message:
          'Operation `responses` should use status code 400 instead of 422 for invalid request payloads.',
        path: [...path, 'responses', '422']
      });
    }

    // 2. Check for a 302.
    if (statusCodes.includes('302')) {
      errors.push({
        message:
          'Operation `responses` should use status code 303 or 307 instead of 302.',
        path: [...path, 'responses', '302']
      });
    }

    // 3. Make sure we have at least one success code.
    if (!successCodes.length && !('101' in operation.responses)) {
      errors.push({
        message:
          'Operation `responses` should include at least one success status code (2xx).',
        path: [...path, 'responses']
      });
    }

    // 4. Make sure we don't have a 101 status code AND success codes.
    if (successCodes.length && '101' in operation.responses) {
      errors.push({
        message:
          'Operation `responses` should not include status code 101 when success status codes (2xx) are present.',
        path: [...path, 'responses', '101']
      });
    }

    // 5. Make sure a 204 response (if present) doesn't have content.
    const response204 = operation.responses['204'];
    if (response204 && response204.content) {
      errors.push({
        message:
          'A 204 response must not include a response body. Use a different status code for responses with content.',
        path: [...path, 'responses', '204', 'content']
      });
    }

    return errors;
  }

  return [];
}

function getResponseCodes(responses) {
  const statusCodes = Object.keys(responses).filter(code =>
    code.match(/^[1-5][0-9][0-9]$/)
  );
  const successCodes = statusCodes.filter(code => code.match(/^2[0-9][0-9]$/));
  return [statusCodes, successCodes];
}

module.exports = responseStatusCodes;
