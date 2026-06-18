/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { pattern } from '@stoplight/spectral-functions';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;

export const description = 'Examples name should not contain space';
export const message = '{{description}}';
export const severity = 'warn';
export const resolved = false;
export const formats = [oas3];
export const given = '$.paths[*][*].responses[*][*][*].examples[*]~';
export const then = {
  function: pattern,
  functionOptions: {
    notMatch: '^(.*\\s+.*)+$',
  },
};
