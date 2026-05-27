/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { arrayResponses } from '../functions/index.js';

export default {
  description:
    'Operations should not return an array as the top-level structure of a response.',
  message: '{{error}}',
  given: operations,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: arrayResponses,
  },
};
