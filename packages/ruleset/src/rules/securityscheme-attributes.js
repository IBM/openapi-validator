/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { securitySchemes } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { securitySchemeAttributes } from '../functions/index.js';

export default {
  description:
    'Validates the attributes of security schemes within an OpenAPI 3 document',
  message: '{{error}}',
  given: securitySchemes,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: securitySchemeAttributes,
  },
};
