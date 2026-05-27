/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import {
  responseSchemas,
  requestBodySchemas,
} from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { acceptAndReturnModels } from '../functions/index.js';

export default {
  description: 'Request and response bodies must be defined as model instances',
  given: [...responseSchemas, ...requestBodySchemas],
  message: '{{error}}',
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: acceptAndReturnModels,
  },
};
