/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { pattern } from '@stoplight/spectral-functions';
import { oas3 } from '@stoplight/spectral-formats';

export default {
  description: 'Examples name should not contain space',
  message: '{{description}}',
  severity: 'warn',
  resolved: false,
  formats: [oas3],
  given: '$.paths[*][*].responses[*][*][*].examples[*]~',
  then: {
    function: pattern,
    functionOptions: {
      notMatch: '^(.*\\s+.*)+$',
    },
  },
};
