/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { schema } from '@stoplight/spectral-functions';

export default {
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
