/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  responseSchemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');

const { requiredEnumPropertiesInResponse } = require('../functions');

module.exports = {
  description: 'Enumeration properties defined in a response must be required.',
  message: '{{error}}',
  given: responseSchemas,
  severity: 'error',
  resolved: true,
  then: {
    function: requiredEnumPropertiesInResponse,
  },
};
