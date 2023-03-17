/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  operations,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { parameterOrder } = require('../functions');

module.exports = {
  description:
    'All required operation parameters should be listed before any optional parameters.',
  message: '{{error}}',
  given: operations,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: parameterOrder,
  },
};
