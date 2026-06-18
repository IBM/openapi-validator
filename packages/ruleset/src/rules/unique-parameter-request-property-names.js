/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { paths } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { uniqueParameterRequestPropertyNames } from '../functions';

export const description =
  'Names of requestBody properties should not be the same as operation parameter names';
export const message = '{{error}}';
export const given = paths;
export const severity = 'error';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: uniqueParameterRequestPropertyNames,
};
