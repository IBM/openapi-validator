/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { circularRefs } from '../functions/index.js';

export default {
  description: 'API definition should not contain circular references.',
  message: '{{error}}',
  given: '$..$ref',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: circularRefs,
  },
};
