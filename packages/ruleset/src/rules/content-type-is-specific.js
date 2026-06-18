/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { falsy } from '@stoplight/spectral-functions';

export const description =
  '*/* should only be used when all content types are supported';
export const formats = [oas3];
export const severity = 'warn';
export const resolved = true;
export const given = [
  '$.paths[*][*][parameters,responses][*].content',
  '$.paths[*][*][requestBody].content',
];
export const then = {
  field: '*/*',
  function: falsy,
};
