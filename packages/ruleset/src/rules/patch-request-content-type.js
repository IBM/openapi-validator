/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  patchOperations,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { patchRequestContentType } = require('../functions');

module.exports = {
  description:
    'PATCH operations should support content types application/json-patch+json or application/merge-patch+json',
  message: '{{description}}',
  given: patchOperations,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: patchRequestContentType,
  },
};
