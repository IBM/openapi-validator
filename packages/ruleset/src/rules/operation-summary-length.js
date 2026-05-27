/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { operationSummaryLength } from '../functions/index.js';

export default {
  description: 'Operation summaries must be 80 characters or less in length',
  given: operations.map(op => `${op}.summary`),
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: operationSummaryLength,
  },
};
