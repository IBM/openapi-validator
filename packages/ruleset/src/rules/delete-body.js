/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { deleteBody } from '../functions/index.js';

export default {
  description: 'Delete operations should not contain a requestBody.',
  message: '{{error}}',
  severity: 'off',
  formats: [oas3],
  resolved: true,
  given: operations,
  then: {
    function: deleteBody,
  },
};
