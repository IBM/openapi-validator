/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { avoidMultipleTypes } from '../functions/index.js';
import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats'
const { oas3_1 } = spectralFormats;

export const description =
  'OpenAPI 3.1 documents should avoid multiple types in the schema "type" field.';
export const message = '{{error}}';
export const given = schemas;
export const severity = 'error';
export const formats = [oas3_1];
export const resolved = true;
export const then = {
  function: avoidMultipleTypes,
};
