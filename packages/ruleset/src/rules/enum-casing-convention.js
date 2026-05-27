/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { enumCasingConvention } from '../functions/index.js';

export default {
  description: 'Enum values must follow a specified case convention',
  message: '{{error}}',
  formats: [oas3],
  given: schemas,
  severity: 'error',
  then: {
    function: enumCasingConvention,
    functionOptions: {
      type: 'snake',
    },
  },
};
