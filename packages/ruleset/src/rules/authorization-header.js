/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { parameters } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { disallowedHeaderParameter } from '../functions';

export const description =
  'Operations should not explicitly define the Authorization header parameter';
export const message = '{{description}}';
export const formats = [oas3];
export const given = parameters;
export const severity = 'warn';
export const then = {
  function: disallowedHeaderParameter,
  functionOptions: {
    headerName: 'Authorization',
  },
};
