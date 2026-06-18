/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { parameterOrder } from '../functions';

export const description =
  'All required operation parameters should be listed before any optional parameters.';
export const message = '{{error}}';
export const given = operations;
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: parameterOrder,
};
