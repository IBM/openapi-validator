/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { binarySchemas } from '../functions/index.js';

// 1. Parameters should not contain binary (type: string, format: binary) values.
// 2. JSON request bodies should not contain binary (type: string, format: binary) values.
// 3. JSON response bodies should not contain binary (type: string, format: binary) values.
export default {
  description:
    'Checks that binary schemas are used only in the proper places within an API definition.',
  message: '{{error}}',
  formats: [oas3],
  given: schemas,
  severity: 'warn',
  resolved: true,
  then: {
    function: binarySchemas,
  },
};
