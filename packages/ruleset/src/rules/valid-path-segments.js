/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { paths } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { validatePathSegments } from '../functions';

export const description =
  'Validates individual path segments within a path string';
export const message = '{{error}}';
export const formats = [oas3];
export const given = paths;
export const severity = 'error';
export const resolved = true;
export const then = {
  function: validatePathSegments,
};
