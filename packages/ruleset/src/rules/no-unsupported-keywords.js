/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { noUnsupportedKeywords } from '../functions/index.js';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3_1 } = spectralFormats;

export const description =
  'Verifies that unsupported OpenAPI 3.1 keywords are not used in the API document.';
export const message = '{{error}}';
export const given = ['$'];
export const severity = 'error';
export const formats = [oas3_1];
export const resolved = false;
export const then = {
  function: noUnsupportedKeywords,
};
