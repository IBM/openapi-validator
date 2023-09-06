/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { noNullableProperties } = require('../functions');

module.exports = {
  description:
    'Nullable properties should exist only in JSON merge-patch request bodies',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: schemas,
  then: {
    function: noNullableProperties,
  },
};
