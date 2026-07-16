/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { noSuperfluousAllOf } from '../functions/index.js';

export const description =
  'Avoid schemas containing only a single-element allOf';
export const given = schemas;
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: noSuperfluousAllOf,
};
