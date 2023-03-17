/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  operations,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { preconditionHeader } = require('../functions');

module.exports = {
  description:
    'Operations with `412` response must support at least one conditional header.',
  message: '{{error}}',
  formats: [oas3],
  given: operations,
  severity: 'error',
  resolved: true,
  then: {
    function: preconditionHeader,
  },
};
