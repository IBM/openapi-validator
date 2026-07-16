/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { validSchemaExample } from '../functions/index.js';

export const description =
  'Schema examples should validate against the schema they are defined for';
export const message = '{{error}}';
export const given = schemas;
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: validSchemaExample,
};
