/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { circularRefs } from '../functions';

export const description =
  'API definition should not contain circular references.';
export const message = '{{error}}';
export const given = '$..$ref';
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: circularRefs,
};
