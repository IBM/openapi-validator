/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  paths,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { paginationStyle } = require('../functions');

module.exports = {
  description: 'List operations should have correct pagination style',
  message: '{{error}}',
  given: paths,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: paginationStyle,
  },
};
