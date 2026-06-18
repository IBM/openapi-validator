/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { responseStatusCodes } from '../functions';

export const description =
  'Performs multiple checks on the status codes used in operation responses';
export const message = '{{error}}';
export const formats = [oas3];
export const given = operations;
export const severity = 'warn';
export const resolved = true;
export const then = {
  function: responseStatusCodes,
};
