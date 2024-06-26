/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  operations,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { requestBodyName } = require('../functions');

module.exports = {
  description:
    'Verifies that operations have the x-codegen-request-body-name extension set when needed',
  message: '{{error}}',
  given: operations,
  severity: 'off',
  formats: [oas3],
  resolved: true,
  then: {
    function: requestBodyName,
  },
};
