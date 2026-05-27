/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { schemaOrContentProvided } from '../functions/index.js';

export default {
  description: 'Parameter must provide either a schema or content',
  message: '{{error}}',
  severity: 'error',
  formats: [oas3],
  resolved: true,
  given: '$.paths[*][*].parameters[*]',
  then: {
    function: schemaOrContentProvided,
  },
};
