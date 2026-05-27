/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { parameters } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { parameterDescriptionExists } from '../functions/index.js';

export default {
  description: 'Parameters should have a non-empty description',
  message: '{{error}}',
  given: parameters,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: parameterDescriptionExists,
  },
};
