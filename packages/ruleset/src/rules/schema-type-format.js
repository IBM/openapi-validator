/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { schemaTypeFormat } from '../functions';

export const description =
  'Schemas and schema properties must use a valid combination of type and format';
export const message = '{{error}}';
export const given = schemas;
export const severity = 'error';
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: schemaTypeFormat,
};
