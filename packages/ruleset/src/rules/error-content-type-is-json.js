/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { truthy } = require('@stoplight/spectral-functions');

module.exports = {
  description: 'error response should support application/json',
  formats: [oas3],
  severity: 'warn',
  resolved: true,
  given: [
    '$.paths[*][*].responses[?(@property >= 400 && @property < 600)].content',
  ],
  then: {
    field: 'application/json',
    function: truthy,
  },
};
