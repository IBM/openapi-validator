/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { schemaTypeExists } from '../functions/index.js';

export default {
  description:
    'Schemas and schema properties should have a non-empty `type` field. **This rule is disabled by default.**',
  message: '{{error}}',
  given: schemas,
  severity: 'off',
  formats: [oas3],
  resolved: true,
  then: {
    function: schemaTypeExists,
  },
};
