/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { schemaCasingConvention } = require('../functions');

module.exports = {
  description: 'Schema names must follow a specified case convention',
  message: '{{error}}',
  formats: [oas3],
  given: ['$.components'],
  severity: 'warn',
  then: {
    function: schemaCasingConvention,
    functionOptions: {
      match: '/^[A-Z]+[a-z0-9]+([A-Z]+[a-z0-9]*)*$/',
    },
  },
};
