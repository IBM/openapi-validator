/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { anchoredPatterns } from '../functions/index.js';

export const description = 'Pattern attributes should be anchored with ^ and $';
export const message = '{{error}}';
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const given = schemas;
export const then = {
  function: anchoredPatterns,
};
