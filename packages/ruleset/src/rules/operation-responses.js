/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  operations,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3_1 } = require('@stoplight/spectral-formats');
const { truthy } = require('@stoplight/spectral-functions');

module.exports = {
  description: 'Verifies that each operation has a "responses" field',
  message: 'Operations MUST have a "responses" field',
  severity: 'error',
  formats: [oas3_1],
  resolved: true,
  given: operations,
  then: {
    field: 'responses',
    function: truthy,
  },
};
