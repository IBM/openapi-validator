/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  responseSchemas,
  requestBodySchemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { acceptAndReturnModels } = require('../functions');

module.exports = {
  description: 'Request and response bodies must be defined as model instances',
  given: [...responseSchemas, ...requestBodySchemas],
  message: '{{error}}',
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: acceptAndReturnModels,
  },
};
