/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3_1 } from '@stoplight/spectral-formats';
import { patternPropertiesCheck } from '../functions/index.js';
import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';

export default {
  description:
    'Enforces certain restrictions on the use of "patternProperties" within a schema.',
  message: '{{error}}',
  given: schemas,
  severity: 'error',
  formats: [oas3_1],
  resolved: true,
  then: {
    function: patternPropertiesCheck,
  },
};
