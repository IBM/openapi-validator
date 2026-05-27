/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { useDateBasedFormat } from '../functions/index.js';

export default {
  description:
    'Heuristically determine when a schema should have a format of "date" or "date-time"',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: schemas,
  then: {
    function: useDateBasedFormat,
  },
};
