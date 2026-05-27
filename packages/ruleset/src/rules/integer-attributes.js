/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { integerAttributes } from '../functions/index.js';

export default {
  description: 'Integer schemas should have certain attributes defined',
  message: '{{error}}',
  severity: 'error',
  formats: [oas3],
  resolved: true,
  given: schemas,
  then: {
    function: integerAttributes,
  },
};
