/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { requestBodyName } from '../functions/index.js';

export default {
  description:
    'Verifies that operations have the x-codegen-request-body-name extension set when needed',
  message: '{{error}}',
  given: operations,
  severity: 'off',
  formats: [oas3],
  resolved: true,
  then: {
    function: requestBodyName,
  },
};
