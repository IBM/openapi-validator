/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { apiSymmetry } from '../functions';

export const description =
  'Variations of a resource schema should be graph fragments of the canonical schema';
export const message = '{{error}}';
export const given = ['$'];
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: apiSymmetry,
};
