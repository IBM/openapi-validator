/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { refPattern } from '../functions';

export const description = '$refs must follow the correct pattern.';
export const message = '{{error}}';
export const given = '$..$ref';
export const severity = 'warn';
export const formats = [oas3];
export const resolved = false;
export const then = {
  function: refPattern,
};
