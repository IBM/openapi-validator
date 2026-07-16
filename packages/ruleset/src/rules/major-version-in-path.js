/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { majorVersionInPath } from '../functions/index.js';

export const description =
  'All paths must contain the API major version as a distinct path segment';
export const message = '{{error}}';
export const formats = [oas3];
export const given = '$';
export const severity = 'warn';
export const then = {
  function: majorVersionInPath,
};
