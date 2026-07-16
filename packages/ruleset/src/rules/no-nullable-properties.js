/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { noNullableProperties } from '../functions/index.js';

export const description =
  'Nullable properties should exist only in JSON merge-patch request bodies';
export const message = '{{error}}';
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const given = schemas;
export const then = {
  function: noNullableProperties,
};
