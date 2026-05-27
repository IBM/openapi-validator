/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { resourceResponseConsistency } from '../functions/index.js';

export default {
  description:
    'Operations that create or update a resource should return the same schema as the "GET" request for the resource.',
  message: '{{error}}',
  formats: [oas3],
  given: [`$.paths[*][put,post,patch]`],
  severity: 'warn',
  resolved: true,
  then: {
    function: resourceResponseConsistency,
  },
};
