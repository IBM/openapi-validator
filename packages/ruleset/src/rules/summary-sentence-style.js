/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { pattern } from '@stoplight/spectral-functions';

export default {
  description: 'Operation summaries should not have a trailing period',
  severity: 'warn',
  formats: [oas3],
  resolved: false,
  given: '$.paths[*][*].summary',
  then: {
    function: pattern,
    functionOptions: {
      notMatch: '\\.$',
    },
  },
};
