/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';

export const description = 'Content entries must specify a schema';
export const formats = [oas3];
export const given = [
  '$.paths[*][post,put,patch].requestBody.content[*]',
  '$.paths[*][get,post,put,patch,delete][parameters,responses][*].content[*]',
];
export const severity = 'warn';
export const resolved = true;
export const then = {
  field: 'schema',
  function: truthy,
};
