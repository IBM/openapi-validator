/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  parameters,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { disallowedHeaderParameter } = require('../functions');

module.exports = {
  description:
    'Operations should not explicitly define the Authorization header parameter',
  message: '{{description}}',
  formats: [oas3],
  given: parameters,
  severity: 'warn',
  then: {
    function: disallowedHeaderParameter,
    functionOptions: {
      headerName: 'Authorization',
    },
  },
};
