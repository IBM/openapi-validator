/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { truthy } = require('@stoplight/spectral-functions');

module.exports = {
  description: 'Server variable should have default value',
  severity: 'warn',
  resolved: false,
  formats: [oas3],
  given: '$.servers[*][variables][*][default]',
  then: {
    function: truthy,
  },
};
