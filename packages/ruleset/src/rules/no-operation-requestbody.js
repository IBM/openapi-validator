/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  operations,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { noOperationRequestBody } = require('../functions');

module.exports = {
  description: 'Certain operations should not contain a requestBody',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: operations,
  then: {
    function: noOperationRequestBody,
    functionOptions: {
      // HTTP methods that should NOT have a requestBody:
      httpMethods: ['delete', 'get', 'head', 'options'],
    },
  },
};
