/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { collectionArrayProperty } from '../functions/index.js';

export const description =
  'Collection list operation response schema should define array property whose name matches the final path segment of the operation path';
export const message = '{{error}}';
export const given =
  '$.paths[*].get.responses[?(@property.match(/2\\d\\d/))].content[*].schema';
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: collectionArrayProperty,
};
