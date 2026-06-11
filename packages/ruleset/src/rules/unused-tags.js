/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { unusedTags } from '../functions';

export const description = 'Checks that each defined tag is actually used';
export const message = '{{error}}';
export const given = ['$'];
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: unusedTags,
};
