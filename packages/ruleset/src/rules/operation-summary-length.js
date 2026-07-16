/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { operationSummaryLength } from '../functions/index.js';

export const description =
  'Operation summaries must be 80 characters or less in length';
export const given = operations.map(op => `${op}.summary`);
export const severity = 'error';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: operationSummaryLength,
};
