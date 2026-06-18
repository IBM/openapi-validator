/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { truthy } from '@stoplight/spectral-functions';

export const description = 'Server variable should have default value';
export const severity = 'warn';
export const resolved = false;
export const formats = [oas3];
export const given = '$.servers[*][variables][*][default]';
export const then = {
  function: truthy,
};
