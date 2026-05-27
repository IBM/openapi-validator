/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { paths } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { uniqueParameterRequestPropertyNames } from '../functions/index.js';

export default {
  description:
    'Names of requestBody properties should not be the same as operation parameter names',
  message: '{{error}}',
  given: paths,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: uniqueParameterRequestPropertyNames,
  },
};
