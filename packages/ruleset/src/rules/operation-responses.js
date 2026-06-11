/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3_1 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';

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
