/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { securitySchemes } from '../functions/index.js';

export const description =
  'Validates the security schemes within an OpenAPI 3 document';
export const message = '{{error}}';
export const given = ['$'];
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: securitySchemes,
};
