/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';

export default {
  description: 'error response should support application/json',
  formats: [oas3],
  severity: 'warn',
  resolved: true,
  given: [
    '$.paths[*][*].responses[?(@property >= 400 && @property < 600)].content',
  ],
  then: {
    field: 'application/json',
    function: truthy,
  },
};
