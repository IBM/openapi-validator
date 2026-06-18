/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { optionalRequestBodyDeprecated } from '../functions';

export const description =
  'An optional requestBody with required properties should probably be required';
export const message = '{{description}}';
export const given =
  "$.paths[*][*][?(@property === 'requestBody' && @.required !== true)].content[*].schema";
export const severity = 'off';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: optionalRequestBodyDeprecated,
};
