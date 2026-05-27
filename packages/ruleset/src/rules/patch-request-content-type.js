/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { patchOperations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { patchRequestContentType } from '../functions/index.js';

export default {
  description:
    'PATCH operations should support content types application/json-patch+json or application/merge-patch+json',
  message: '{{description}}',
  given: patchOperations,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: patchRequestContentType,
  },
};
