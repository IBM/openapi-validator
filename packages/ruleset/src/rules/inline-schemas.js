/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  unresolvedSchemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { inlineSchemas } = require('../functions');

module.exports = {
  description: 'Nested objects should be defined as a $ref to a named schema',
  message: '{{error}}',
  formats: [oas3],
  given: unresolvedSchemas,
  severity: 'warn',
  resolved: false,
  then: {
    function: inlineSchemas,
  },
};
