/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { redirectResponseBody } from '../functions';

export const description =
  'Performs multiple checks on the response body based on status codes';
export const message = '{{error}}';
export const formats = [oas3];
export const given = operations;
export const severity = 'error';
export const resolved = true;
export const then = {
  function: redirectResponseBody,
};
