/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { patternPropertiesCheck } from '../functions/index.js';
import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3_1 } = spectralFormats;

export const description =
  'Enforces certain restrictions on the use of "patternProperties" within a schema.';
export const message = '{{error}}';
export const given = schemas;
export const severity = 'error';
export const formats = [oas3_1];
export const resolved = true;
export const then = {
  function: patternPropertiesCheck,
};
