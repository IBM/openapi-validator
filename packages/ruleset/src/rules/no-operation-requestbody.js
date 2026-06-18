/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operations } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;;
import { noOperationRequestBody } from '../functions';

export const description =
  'Certain operations should not contain a requestBody';
export const message = '{{error}}';
export const severity = 'warn';
export const formats = [oas3];
export const resolved = true;
export const given = operations;
export const then = {
  function: noOperationRequestBody,
  functionOptions: {
    // HTTP methods that should NOT have a requestBody:
    httpMethods: ['delete', 'get', 'head', 'options'],
  },
};
