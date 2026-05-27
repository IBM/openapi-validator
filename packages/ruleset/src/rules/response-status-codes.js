/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { responseStatusCodes } from '../functions/index.js';

export default {
  description:
    'Performs multiple checks on the status codes used in operation responses',
  message: '{{error}}',
  formats: [oas3],
  given: operations,
  severity: 'warn',
  resolved: true,
  then: {
    function: responseStatusCodes,
  },
};
