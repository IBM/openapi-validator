/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';

export default {
  description: 'Content entries must specify a schema',
  formats: [oas3],
  given: [
    '$.paths[*][post,put,patch].requestBody.content[*]',
    '$.paths[*][get,post,put,patch,delete][parameters,responses][*].content[*]',
  ],
  severity: 'warn',
  resolved: true,
  then: {
    field: 'schema',
    function: truthy,
  },
};
