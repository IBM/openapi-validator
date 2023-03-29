/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { pathParameterNotCRN } = require('../functions');

module.exports = {
  description:
    'Path parameters should not be defined as a CRN (Cloud Resource Name) value',
  message: '{{error}}',
  formats: [oas3],
  given: [
    '$.paths[*].parameters[?(@.in === "path")]',
    '$.paths[*][get,put,post,delete,options,head,patch,trace].parameters[?(@.in === "path")]',
  ],
  severity: 'warn',
  resolved: true,
  then: {
    function: pathParameterNotCRN,
  },
};
