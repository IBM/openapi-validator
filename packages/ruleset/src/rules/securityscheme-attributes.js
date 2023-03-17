/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  securitySchemes,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { securitySchemeAttributes } = require('../functions');

module.exports = {
  description:
    'Validates the attributes of security schemes within an OpenAPI 3 document',
  message: '{{error}}',
  given: securitySchemes,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: securitySchemeAttributes,
  },
};
