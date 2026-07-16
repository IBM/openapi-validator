/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { enumCasingConvention } from '../functions/index.js';

export const description =
  'Enum values must follow a specified case convention';
export const message = '{{error}}';
export const formats = [oas3];
export const given = schemas;
export const severity = 'error';
export const then = {
  function: enumCasingConvention,
  functionOptions: {
    type: 'snake',
  },
};
