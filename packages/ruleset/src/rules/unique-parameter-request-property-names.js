/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  paths,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { uniqueParameterRequestPropertyNames } = require('../functions');

module.exports = {
  description:
    'Names of requestBody properties should not be the same as operation parameter names',
  message: '{{error}}',
  given: paths,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: uniqueParameterRequestPropertyNames,
  },
};
