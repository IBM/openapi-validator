/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { schemaNamingConvention } = require('../functions');

module.exports = {
  description: 'Schemas should follow naming conventions in the API Handbook',
  message: '{{error}}',
  given: ['$'],
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: schemaNamingConvention,
  },
};
