/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3_1 } from '@stoplight/spectral-formats';
import { noUnsupportedKeywords } from '../functions';

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
