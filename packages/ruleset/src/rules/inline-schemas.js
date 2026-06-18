/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { unresolvedSchemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { inlineSchemas } from '../functions';

export const description =
  'Nested objects should be defined as a $ref to a named schema';
export const message = '{{error}}';
export const formats = [oas3];
export const given = unresolvedSchemas;
export const severity = 'warn';
export const resolved = false;
export const then = {
  function: inlineSchemas,
};
