/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { requestBodyName } from '../functions/index.js';

export const description =
  'Verifies that operations have the x-codegen-request-body-name extension set when needed';
export const message = '{{error}}';
export const given = operations;
export const severity = 'off';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: requestBodyName,
};
