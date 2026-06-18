/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { parameters } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { disallowedHeaderParameter } from '../functions/index.js';

export const description =
  'Operations should not explicitly define the Content-Type header parameter';
export const message = '{{description}}';
export const formats = [oas3];
export const given = parameters;
export const severity = 'warn';
export const then = {
  function: disallowedHeaderParameter,
  functionOptions: {
    headerName: 'Content-Type',
  },
};
