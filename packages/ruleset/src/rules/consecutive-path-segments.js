/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  paths,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { consecutivePathSegments } = require('../functions');

module.exports = {
  description:
    'Path strings should not contain two or more consecutive path parameter references',
  message: '{{error}}',
  formats: [oas3],
  given: paths,
  severity: 'error',
  resolved: true,
  then: {
    function: consecutivePathSegments,
  },
};
