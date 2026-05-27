/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { securitySchemes } from '../functions/index.js';

export default {
  description: 'Validates the security schemes within an OpenAPI 3 document',
  message: '{{error}}',
  given: ['$'],
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: securitySchemes,
  },
};
