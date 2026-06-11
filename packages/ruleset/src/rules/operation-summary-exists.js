/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { operationSummaryExists } from '../functions';

export const description = 'Operations must have a non-empty summary';
export const given = operations;
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: operationSummaryExists,
};
