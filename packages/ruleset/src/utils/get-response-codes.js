/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isObject } = require('@ibm-cloud/openapi-ruleset-utilities');

/**
 * For an OpenAPI 'responses' object, gather all of the defined
 * status codes, as well as the success (2XX) codes, and return
 * them together as a tuple.
 */
function getResponseCodes(responses) {
  if (!isObject(responses)) {
    return [[], []];
  }
  const statusCodes = Object.keys(responses).filter(code =>
    code.match(/^[1-5][0-9][0-9]$/)
  );
  const successCodes = statusCodes.filter(code => code.match(/^2[0-9][0-9]$/));
  return [statusCodes, successCodes];
}

module.exports = getResponseCodes;
