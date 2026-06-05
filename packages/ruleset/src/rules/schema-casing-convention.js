/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { schemaCasingConvention } from '../functions/index.js';

export const description =
  'Schema names must follow a specified case convention';
export const message = '{{error}}';
export const formats = [oas3];
export const given = ['$.components'];
export const severity = 'warn';
export const then = {
  function: schemaCasingConvention,
  functionOptions: {
    match: '/^[A-Z]+[a-z0-9]+([A-Z]+[a-z0-9]*)*$/',
  },
};
