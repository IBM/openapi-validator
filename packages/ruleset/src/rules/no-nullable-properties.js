/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from '@stoplight/spectral-formats';
import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { noNullableProperties } from '../functions';

export const description =
  'Nullable properties should exist only in JSON merge-patch request bodies';
export const message = '{{error}}';
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const given = schemas;
export const then = {
  function: noNullableProperties,
};
