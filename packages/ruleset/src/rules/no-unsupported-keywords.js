/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3_1 } from '@stoplight/spectral-formats';
import { noUnsupportedKeywords } from '../functions/index.js';

export default {
  description:
    'Verifies that unsupported OpenAPI 3.1 keywords are not used in the API document.',
  message: '{{error}}',
  given: ['$'],
  severity: 'error',
  formats: [oas3_1],
  resolved: false,
  then: {
    function: noUnsupportedKeywords,
  },
};
