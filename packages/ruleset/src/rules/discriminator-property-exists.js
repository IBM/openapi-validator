/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { discriminatorPropertyExists } from '../functions';

export const description =
  'The discriminator property name must be defined in this schema';
export const message = '{{error}}';
export const given = schemas;
export const severity = 'error';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: discriminatorPropertyExists,
};
