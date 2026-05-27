/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { falsy } from '@stoplight/spectral-functions';

export default {
  description: '*/* should only be used when all content types are supported',
  formats: [oas3],
  severity: 'warn',
  resolved: true,
  given: [
    '$.paths[*][*][parameters,responses][*].content',
    '$.paths[*][*][requestBody].content',
  ],
  then: {
    field: '*/*',
    function: falsy,
  },
};
