/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { unusedTags } = require('../functions');

module.exports = {
  description: 'Checks that each defined tag is actually used',
  message: '{{error}}',
  given: ['$'],
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: unusedTags,
  },
};
