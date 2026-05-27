/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { majorVersionInPath } from '../functions/index.js';

export default {
  description:
    'All paths must contain the API major version as a distinct path segment',
  message: '{{error}}',
  formats: [oas3],
  given: '$',
  severity: 'warn',
  then: {
    function: majorVersionInPath,
  },
};
