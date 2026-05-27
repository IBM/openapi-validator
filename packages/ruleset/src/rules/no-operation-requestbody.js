/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { noOperationRequestBody } from '../functions/index.js';

export default {
  description: 'Certain operations should not contain a requestBody',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: operations,
  then: {
    function: noOperationRequestBody,
    functionOptions: {
      // HTTP methods that should NOT have a requestBody:
      httpMethods: ['delete', 'get', 'head', 'options'],
    },
  },
};
