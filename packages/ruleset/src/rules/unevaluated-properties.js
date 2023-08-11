/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3_1 } = require('@stoplight/spectral-formats');
const { unevaluatedProperties } = require('../functions');
const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');

module.exports = {
  description:
    'Enforces certain restrictions on the use of "unevaluatedProperties" within a schema.',
  message: '{{error}}',
  given: schemas,
  severity: 'error',
  formats: [oas3_1],
  resolved: true,
  then: {
    function: unevaluatedProperties,
  },
};
