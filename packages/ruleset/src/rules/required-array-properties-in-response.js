/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { responseSchemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';

import { requiredArrayPropertiesInResponse } from '../functions/index.js';

export default {
  description: 'Array properties defined in a response should be required.',
  message: '{{error}}',
  given: responseSchemas,
  severity: 'error',
  resolved: true,
  then: {
    function: requiredArrayPropertiesInResponse,
  },
};
