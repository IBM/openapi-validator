/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { operationIdCasingConvention } from '../functions/index.js';

export default {
  description: 'Operation ids must follow a specified case convention',
  message: '{{error}}',
  formats: [oas3],
  given: operations,
  severity: 'warn',
  then: {
    function: operationIdCasingConvention,
    functionOptions: {
      type: 'snake',
    },
  },
};
