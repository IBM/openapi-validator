/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { truthy } = require('@stoplight/spectral-functions');

module.exports = {
  description: 'Content entries must specify a schema',
  formats: [oas3],
  given: [
    '$.paths[*][post,put,patch].requestBody.content[*]',
    '$.paths[*][get,post,put,patch,delete][parameters,responses][*].content[*]',
  ],
  severity: 'warn',
  resolved: true,
  then: {
    field: 'schema',
    function: truthy,
  },
};
