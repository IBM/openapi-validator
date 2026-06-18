/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { parameters } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { parameterDefault } from '../functions/index.js';
import spectralFormats from '@stoplight/spectral-formats'
const { oas2, oas3 } = spectralFormats;

export const description =
  'Required parameters should not define a default value';
export const message = '{{error}}';
export const given = parameters;
export const severity = 'warn';
export const formats = [oas2, oas3];
export const resolved = true;
export const then = {
  function: parameterDefault,
};
