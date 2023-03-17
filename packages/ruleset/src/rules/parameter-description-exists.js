/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  parameters,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { parameterDescriptionExists } = require('../functions');

module.exports = {
  description: 'Parameters should have a non-empty description',
  message: '{{error}}',
  given: parameters,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: parameterDescriptionExists,
  },
};
