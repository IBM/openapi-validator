/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3_1 } from '@stoplight/spectral-formats';
import { unevaluatedProperties } from '../functions';
import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';

export const description =
  'Enforces certain restrictions on the use of "unevaluatedProperties" within a schema.';
export const message = '{{error}}';
export const given = schemas;
export const severity = 'error';
export const formats = [oas3_1];
export const resolved = true;
export const then = {
  function: unevaluatedProperties,
};
