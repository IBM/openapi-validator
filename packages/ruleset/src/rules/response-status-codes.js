/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  operations,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { responseStatusCodes } = require('../functions');

module.exports = {
  description:
    'Performs multiple checks on the status codes used in operation responses',
  message: '{{error}}',
  formats: [oas3],
  given: operations,
  severity: 'warn',
  resolved: true,
  then: {
    function: responseStatusCodes,
  },
};
