/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { stringAttributes } = require('../functions');

module.exports = {
  description: 'String schemas should have certain attributes defined',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: [
    '$.paths[*][parameters][*].schema',
    '$.paths[*][parameters][*].content[*].schema',
    '$.paths[*][*][parameters][*].schema',
    '$.paths[*][*][parameters][*].content[*].schema',
    '$.paths[*][*].requestBody.content[*].schema',
  ],
  then: {
    function: stringAttributes,
  },
};
