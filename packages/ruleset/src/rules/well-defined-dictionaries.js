/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { wellDefinedDictionaries } from '../functions/index.js';

export default {
  description:
    'Dictionaries must be well defined and all values must share a single type.',
  message: '{{error}}',
  given: schemas,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: wellDefinedDictionaries,
  },
};
