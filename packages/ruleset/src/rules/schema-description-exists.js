/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { schemaDescriptionExists } from '../functions';

export const description = 'Schemas should have a non-empty description';
export const message = '{{error}}';
export const given = schemas;
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: schemaDescriptionExists,
};
