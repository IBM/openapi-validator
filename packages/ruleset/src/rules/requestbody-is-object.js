/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { enumeration } from '@stoplight/spectral-functions';

export default {
  description: 'All request bodies MUST be structured as an object',
  given:
    '$.paths[*][*].requestBody.content[?(@property ~= "^application\\\\/json(;.*)*$")].schema',
  severity: 'error',
  then: {
    field: 'type',
    function: enumeration,
    functionOptions: {
      values: ['object'],
    },
  },
};
