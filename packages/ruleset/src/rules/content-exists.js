/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { truthy } = require('@stoplight/spectral-functions');

module.exports = {
  description:
    'Request bodies and non-204 responses should define a content object',
  given: [
    "$.paths[*][get,post,put,patch,delete].responses[?(@property != '204' && @property != '202' && @property != '101' && @property != '304')]",
    '$.paths[*][*].requestBody',
  ],
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    field: 'content',
    function: truthy,
  },
};
