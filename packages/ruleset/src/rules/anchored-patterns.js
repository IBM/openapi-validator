/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { anchoredPatterns } = require('../functions');

module.exports = {
  description: 'Pattern attributes should be anchored with ^ and $',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: schemas,
  then: {
    function: anchoredPatterns,
  },
};
