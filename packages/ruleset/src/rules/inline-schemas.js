/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { unresolvedSchemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { inlineSchemas } from '../functions/index.js';

export default {
  description: 'Nested objects should be defined as a $ref to a named schema',
  message: '{{error}}',
  formats: [oas3],
  given: unresolvedSchemas,
  severity: 'warn',
  resolved: false,
  then: {
    function: inlineSchemas,
  },
};
