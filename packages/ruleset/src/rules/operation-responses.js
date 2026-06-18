/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { truthy } from '@stoplight/spectral-functions';
import spectralFormats from '@stoplight/spectral-formats'
const { oas3_1 } = spectralFormats;

export const description =
  'Verifies that each operation has a "responses" field';
export const message = 'Operations MUST have a "responses" field';
export const severity = 'error';
export const formats = [oas3_1];
export const resolved = true;
export const given = operations;
export const then = {
  field: 'responses',
  function: truthy,
};
