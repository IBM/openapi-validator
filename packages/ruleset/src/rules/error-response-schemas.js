/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { errorResponseSchemas } = require('../functions');

module.exports = {
  description:
    'Error response schemas should comply with API Handbook guidance',
  message: '{{error}}',
  given:
    '$.paths[*][*].responses[?(@property >= 400 && @property < 600)].content[*].schema',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: errorResponseSchemas,
  },
};
