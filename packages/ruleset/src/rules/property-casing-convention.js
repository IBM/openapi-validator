/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { propertyCasingConvention } from '../functions';

export const description =
  'Property names must follow a specified case convention';
export const message = '{{error}}';
export const formats = [oas3];
export const given = schemas;
export const severity = 'error';
export const then = {
  function: propertyCasingConvention,
  functionOptions: {
    type: 'snake',
  },
};
