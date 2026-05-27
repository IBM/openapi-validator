/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { parameterOrder } from '../functions/index.js';

export default {
  description:
    'All required operation parameters should be listed before any optional parameters.',
  message: '{{error}}',
  given: operations,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: parameterOrder,
  },
};
