/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { apiSymmetry } = require('../functions');

module.exports = {
  description:
    'Variations of a resource schema should be graph fragments of the canonical schema',
  message: '{{error}}',
  given: ['$'],
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: apiSymmetry,
  },
};
