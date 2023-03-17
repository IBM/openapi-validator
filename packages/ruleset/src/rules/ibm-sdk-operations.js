/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { schema } = require('@stoplight/spectral-functions');

module.exports = {
  description: 'Ensures that x-sdk-operations fields are properly structured',
  message: '{{error}}',
  given: '$.',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: schema,
    functionOptions: {
      schema: {
        $ref: '../schemas/x-sdk-operations.json',
      },
    },
  },
};
