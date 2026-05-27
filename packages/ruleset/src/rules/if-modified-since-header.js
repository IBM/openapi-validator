/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { parameters } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { disallowedHeaderParameter } from '../functions/index.js';

export default {
  description:
    'Operations should support the If-None-Match header parameter instead of If-Modified-Since',
  message: '{{description}}',
  formats: [oas3],
  given: parameters,
  severity: 'warn',
  resolved: true,
  then: {
    function: disallowedHeaderParameter,
    functionOptions: {
      headerName: 'If-Modified-Since',
    },
  },
};
