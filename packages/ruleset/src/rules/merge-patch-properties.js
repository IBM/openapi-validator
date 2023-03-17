/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { mergePatchProperties } = require('../functions');

module.exports = {
  description:
    'A JSON merge-patch requestBody should have no required properties',
  message: '{{description}}',
  given: [
    // This expression should visit the request body schema for each "merge-patch" type operation.
    '$.paths[*][patch].requestBody.content[?(@property.match(/^application\\/merge-patch\\+json(;.*)*/))].schema',
  ],
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: mergePatchProperties,
  },
};
