/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { preconditionHeader } from '../functions/index.js';

export default {
  description:
    'Operations with `412` response must support at least one conditional header.',
  message: '{{error}}',
  formats: [oas3],
  given: operations,
  severity: 'error',
  resolved: true,
  then: {
    function: preconditionHeader,
  },
};
