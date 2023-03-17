/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { refPattern } = require('../functions');

module.exports = {
  description: '$refs must follow the correct pattern.',
  message: '{{error}}',
  given: '$..$ref',
  severity: 'warn',
  formats: [oas3],
  resolved: false,
  then: {
    function: refPattern,
  },
};
