/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3_1 } = require('@stoplight/spectral-formats');
const { noUnsupportedKeywords } = require('../functions');

module.exports = {
  description:
    'Verifies that unsupported OpenAPI 3.1 keywords are not used in the API document.',
  message: '{{error}}',
  given: ['$'],
  severity: 'error',
  formats: [oas3_1],
  resolved: false,
  then: {
    function: noUnsupportedKeywords,
  },
};
