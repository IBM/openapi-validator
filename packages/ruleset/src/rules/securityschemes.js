/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { securitySchemes } = require('../functions');

module.exports = {
  description: 'Validates the security schemes within an OpenAPI 3 document',
  message: '{{error}}',
  given: ['$'],
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: securitySchemes,
  },
};
