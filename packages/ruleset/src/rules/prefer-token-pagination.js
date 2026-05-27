/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { paths } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { preferTokenPagination } from '../functions/index.js';

export default {
  description:
    'Paginated list operations should use token-based pagination, rather than offset/limit pagination.',
  message: '{{error}}',
  given: paths,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: preferTokenPagination,
  },
};
