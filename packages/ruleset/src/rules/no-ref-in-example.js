/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { noRefInExample } = require('../functions');
module.exports = {
  description: 'The use of $ref is not valid within an example field',
  message: '{{description}}',
  given: ['$..example'],
  severity: 'error',
  formats: [oas3],
  resolved: false,
  then: {
    function: noRefInExample,
  },
};
