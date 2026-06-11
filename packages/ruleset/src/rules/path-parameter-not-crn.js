/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { pathParameterNotCRN } from '../functions';

export const description =
  'Path parameters should not be defined as a CRN (Cloud Resource Name) value';
export const message = '{{error}}';
export const formats = [oas3];
export const given = [
  '$.paths[*].parameters[?(@.in === "path")]',
  '$.paths[*][get,put,post,delete,options,head,patch,trace].parameters[?(@.in === "path")]',
];
export const severity = 'warn';
export const resolved = true;
export const then = {
  function: pathParameterNotCRN,
};
