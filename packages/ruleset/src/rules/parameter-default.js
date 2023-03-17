/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  parameters,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { parameterDefault } = require('../functions');

module.exports = {
  description: 'Required parameters should not define a default value',
  message: '{{error}}',
  given: parameters,
  severity: 'warn',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: parameterDefault,
  },
};
