/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { redirectResponseBody } from '../functions/index.js';

export default {
  description:
    'Performs multiple checks on the response body based on status codes',
  message: '{{error}}',
  formats: [oas3],
  given: operations,
  severity: 'error',
  resolved: true,
  then: {
    function: redirectResponseBody,
  },
};
