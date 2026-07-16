/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { noRefInExample } from '../functions/index.js';
export const description =
  'The use of $ref is not valid within an example field';
export const message = '{{description}}';
export const given = ['$..example'];
export const severity = 'error';
export const formats = [oas3];
export const resolved = false;
export const then = {
  function: noRefInExample,
};
