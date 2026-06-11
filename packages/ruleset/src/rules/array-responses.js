/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { arrayResponses } from '../functions';

export const description =
  'Operations should not return an array as the top-level structure of a response.';
export const message = '{{error}}';
export const given = operations;
export const severity = 'error';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: arrayResponses,
};
