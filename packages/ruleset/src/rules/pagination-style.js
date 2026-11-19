/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { paths } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { paginationStyle } from '../functions/index.js';

export const description =
  'List operations should have correct pagination style';
export const message = '{{error}}';
export const given = paths;
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: paginationStyle,
};
