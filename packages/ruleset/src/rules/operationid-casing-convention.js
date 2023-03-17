/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  operations,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { operationIdCasingConvention } = require('../functions');

module.exports = {
  description: 'Operation ids must follow a specified case convention',
  message: '{{error}}',
  formats: [oas3],
  given: operations,
  severity: 'warn',
  then: {
    function: operationIdCasingConvention,
    functionOptions: {
      type: 'snake',
    },
  },
};
