/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { noAmbiguousPaths } from '../functions/index.js';

export default {
  description: 'Avoid ambiguous path strings within an OpenAPI document',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: ['$.paths'],
  then: {
    function: noAmbiguousPaths,
  },
};
