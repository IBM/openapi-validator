/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { mergePatchProperties } from '../functions';

export const description =
  'A JSON merge-patch requestBody should have no required properties';
export const message = '{{description}}';
export const given = [
  // This expression should visit the request body schema for each "merge-patch" type operation.
  '$.paths[*][patch].requestBody.content[?(@property.match(/^application\\/merge-patch\\+json(;.*)*/))].schema',
];
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: mergePatchProperties,
};
