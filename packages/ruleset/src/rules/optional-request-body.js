/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { optionalRequestBody } from '../functions/index.js';

export default {
  description:
    'An optional requestBody with required properties should probably be required',
  message: '{{description}}',
  given:
    "$.paths[*][*][?(@property === 'requestBody' && @.required !== true)].content[*].schema",
  severity: 'info',
  formats: [oas3],
  resolved: true,
  then: {
    function: optionalRequestBody,
  },
};
