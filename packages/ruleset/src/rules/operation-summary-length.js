/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  operations,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { operationSummaryLength } = require('../functions');

module.exports = {
  description: 'Operation summaries must be 80 characters or less in length',
  given: operations.map(op => `${op}.summary`),
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: operationSummaryLength,
  },
};
