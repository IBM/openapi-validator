/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  operations,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { redirectResponseBody } = require('../functions');

module.exports = {
  description:
    'Performs multiple checks on the response body based on status codes',
  message: '{{error}}',
  formats: [oas3],
  given: operations,
  severity: 'error',
  resolved: true,
  then: {
    function: redirectResponseBody,
  },
};
