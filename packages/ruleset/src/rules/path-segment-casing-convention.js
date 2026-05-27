/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { paths } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { pathSegmentCasingConvention } from '../functions/index.js';

export default {
  description: 'Path segments must follow a specified case convention',
  message: '{{error}}',
  formats: [oas3],
  given: paths,
  severity: 'error',
  then: {
    function: pathSegmentCasingConvention,
    functionOptions: {
      type: 'snake',
    },
  },
};
