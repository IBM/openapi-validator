/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { paths } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { etagHeaderExists } from '../functions/index.js';

export default {
  description:
    'ETag response header should be defined in GET operation for resources that support If-Match or If-None-Match header parameters',
  message: '{{error}}',
  given: paths,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: etagHeaderExists,
  },
};
