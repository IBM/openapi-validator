/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { circularRefs } from '../functions/index.js';

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
