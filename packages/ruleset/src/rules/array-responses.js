/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  operations,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { arrayResponses } = require('../functions');

module.exports = {
  description:
    'Operations should not return an array as the top-level structure of a response.',
  message: '{{error}}',
  given: operations,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: arrayResponses,
  },
};
