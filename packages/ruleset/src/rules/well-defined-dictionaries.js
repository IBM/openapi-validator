/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { wellDefinedDictionaries } from '../functions/index.js';

export const description =
  'Dictionaries must be well defined and all values must share a single type.';
export const message = '{{error}}';
export const given = schemas;
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: wellDefinedDictionaries,
};
