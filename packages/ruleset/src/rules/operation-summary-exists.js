/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  operations
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { operationSummaryExists } = require('../functions');

module.exports = {
  description: 'Operation "summary" must be present and non-empty string.',
  given: operations,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: operationSummaryExists
  }
};
