/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { refSiblingDuplicateDescription } from '../functions/index.js';

export const description =
  'Schemas and schema properties should avoid duplicate descriptions within allOf $ref siblings';
export const message = '{{error}}';
export const given = schemas;
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: refSiblingDuplicateDescription,
};
