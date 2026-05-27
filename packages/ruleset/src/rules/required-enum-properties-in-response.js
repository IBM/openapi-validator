/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { responseSchemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';

import { requiredEnumPropertiesInResponse } from '../functions/index.js';

export default {
  description: 'Enumeration properties defined in a response must be required.',
  message: '{{error}}',
  given: responseSchemas,
  severity: 'error',
  resolved: true,
  then: {
    function: requiredEnumPropertiesInResponse,
  },
};
