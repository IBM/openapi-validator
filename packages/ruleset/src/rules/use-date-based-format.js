/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { useDateBasedFormat } from '../functions';

export const description =
  'Heuristically determine when a schema should have a format of "date" or "date-time"';
export const message = '{{error}}';
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const given = schemas;
export const then = {
  function: useDateBasedFormat,
};
