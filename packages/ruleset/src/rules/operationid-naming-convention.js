/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operationIdNamingConvention } from '../functions/index.js';
import spectralFormats from '@stoplight/spectral-formats';
const { oas2, oas3 } = spectralFormats;

export const description = 'Operation ids should follow naming convention';
export const message = '{{error}}';
export const given = ['$'];
export const severity = 'warn';
export const formats = [oas2, oas3];
export const resolved = true;
export const then = {
  function: operationIdNamingConvention,
  functionOptions: {
    strict: true,
  },
};
