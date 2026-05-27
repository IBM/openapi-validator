/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { noNullableProperties } from '../functions/index.js';

export default {
  description:
    'Nullable properties should exist only in JSON merge-patch request bodies',
  message: '{{error}}',
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  given: schemas,
  then: {
    function: noNullableProperties,
  },
};
