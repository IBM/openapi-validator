/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { binarySchemas } from '../functions';

// 1. Parameters should not contain binary (type: string, format: binary) values.
// 2. JSON request bodies should not contain binary (type: string, format: binary) values.
// 3. JSON response bodies should not contain binary (type: string, format: binary) values.
export const description =
  'Checks that binary schemas are used only in the proper places within an API definition.';
export const message = '{{error}}';
export const formats = [oas3];
export const given = schemas;
export const severity = 'warn';
export const resolved = true;
export const then = {
  function: binarySchemas,
};
