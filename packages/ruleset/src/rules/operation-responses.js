/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3_1 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';

export default {
  description: 'Verifies that each operation has a "responses" field',
  message: 'Operations MUST have a "responses" field',
  severity: 'error',
  formats: [oas3_1],
  resolved: true,
  given: operations,
  then: {
    field: 'responses',
    function: truthy,
  },
};
