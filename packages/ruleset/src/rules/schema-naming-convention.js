/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { schemaNamingConvention } from '../functions/index.js';

export default {
  description: 'Schemas should follow naming conventions in the API Handbook',
  message: '{{error}}',
  given: ['$'],
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: schemaNamingConvention,
  },
};
