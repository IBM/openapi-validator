/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';

export const description = 'error response should support application/json';
export const formats = [oas3];
export const severity = 'warn';
export const resolved = true;
export const given = [
  '$.paths[*][*].responses[?(@property >= 400 && @property < 600)].content',
];
export const then = {
  field: 'application/json',
  function: truthy,
};
