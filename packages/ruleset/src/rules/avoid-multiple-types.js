/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3_1 } from '@stoplight/spectral-formats';
import { avoidMultipleTypes } from '../functions/index.js';
import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';

export default {
  description:
    'OpenAPI 3.1 documents should avoid multiple types in the schema "type" field.',
  message: '{{error}}',
  given: schemas,
  severity: 'error',
  formats: [oas3_1],
  resolved: true,
  then: {
    function: avoidMultipleTypes,
  },
};
