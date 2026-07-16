/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { patchOperations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { patchRequestContentType } from '../functions/index.js';

export const description =
  'PATCH operations should support content types application/json-patch+json or application/merge-patch+json';
export const message = '{{description}}';
export const given = patchOperations;
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: patchRequestContentType,
};
