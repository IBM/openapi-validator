/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { useDateBasedFormat } = require('../functions');

module.exports = {
  description:
    'Heuristically determine when a schema should have a format of "date" or "date-time"',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: schemas,
  then: {
    function: useDateBasedFormat,
  },
};
