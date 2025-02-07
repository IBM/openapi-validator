/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { majorVersionInPath } = require('../functions');

module.exports = {
  description:
    'All paths must contain the API major version as a distinct path segment',
  message: '{{error}}',
  formats: [oas3],
  given: '$',
  severity: 'warn',
  then: {
    function: majorVersionInPath,
  },
};
