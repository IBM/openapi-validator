/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { refPattern } from '../functions/index.js';

export default {
  description: '$refs must follow the correct pattern.',
  message: '{{error}}',
  given: '$..$ref',
  severity: 'warn',
  formats: [oas3],
  resolved: false,
  then: {
    function: refPattern,
  },
};
