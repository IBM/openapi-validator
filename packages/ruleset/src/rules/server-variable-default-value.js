/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';

export default {
  description: 'Server variable should have default value',
  severity: 'warn',
  resolved: false,
  formats: [oas3],
  given: '$.servers[*][variables][*][default]',
  then: {
    function: truthy,
  },
};
