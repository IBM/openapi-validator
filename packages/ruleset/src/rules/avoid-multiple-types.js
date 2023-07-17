/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3_1 } = require('@stoplight/spectral-formats');
const { avoidMultipleTypes } = require('../functions');
const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');

module.exports = {
  description:
    'OpenAPI 3.1 documents should avoid multiple types in the schema "type" field.',
  message: '{{error}}',
  given: schemas,
  severity: 'error',
  formats: [oas3_1],
  resolved: true,
  then: {
    function: avoidMultipleTypes,
  },
};
