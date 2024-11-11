/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { integerAttributes } = require('../functions');

module.exports = {
  description: 'Integer schemas should have certain attributes defined',
  message: '{{error}}',
  severity: 'error',
  formats: [oas3],
  resolved: true,
  given: schemas,
  then: {
    function: integerAttributes,
  },
};
