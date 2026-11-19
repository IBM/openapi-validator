/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { noAmbiguousPaths } from '../functions/index.js';

export const description =
  'Avoid ambiguous path strings within an OpenAPI document';
export const message = '{{error}}';
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const given = ['$.paths'];
export const then = {
  function: noAmbiguousPaths,
};
