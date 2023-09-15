/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { noAmbiguousPaths } = require('../functions');

module.exports = {
  description: 'Avoid ambiguous path strings within an OpenAPI document',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: ['$.paths'],
  then: {
    function: noAmbiguousPaths,
  },
};
