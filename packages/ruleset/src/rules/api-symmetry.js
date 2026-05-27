/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { apiSymmetry } from '../functions/index.js';

export default {
  description:
    'Variations of a resource schema should be graph fragments of the canonical schema',
  message: '{{error}}',
  given: ['$'],
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: apiSymmetry,
  },
};
