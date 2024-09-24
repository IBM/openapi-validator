/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  responseSchemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');

const { requiredArrayPropertiesInResponse } = require('../functions');

module.exports = {
  description: 'Array properties defined in a response should be required.',
  message: '{{error}}',
  given: responseSchemas,
  severity: 'error',
  resolved: true,
  then: {
    function: requiredArrayPropertiesInResponse,
  },
};
