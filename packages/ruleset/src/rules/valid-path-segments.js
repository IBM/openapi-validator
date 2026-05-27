/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { paths } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { validatePathSegments } from '../functions/index.js';

export default {
  description: 'Validates individual path segments within a path string',
  message: '{{error}}',
  formats: [oas3],
  given: paths,
  severity: 'error',
  resolved: true,
  then: {
    function: validatePathSegments,
  },
};
