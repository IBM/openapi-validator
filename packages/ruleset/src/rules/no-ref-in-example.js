/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { noRefInExample } from '../functions/index.js';
export default {
  description: 'The use of $ref is not valid within an example field',
  message: '{{description}}',
  given: ['$..example'],
  severity: 'error',
  formats: [oas3],
  resolved: false,
  then: {
    function: noRefInExample,
  },
};
