/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { parameters } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas2, oas3 } from '@stoplight/spectral-formats';
import { parameterDefault } from '../functions/index.js';

export default {
  description: 'Required parameters should not define a default value',
  message: '{{error}}',
  given: parameters,
  severity: 'warn',
  formats: [oas2, oas3],
  resolved: true,
  then: {
    function: parameterDefault,
  },
};
