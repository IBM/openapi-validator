/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import spectralFormats from '@stoplight/spectral-formats';
const { oas3 } = spectralFormats;
import { propertyConsistentNameAndType } from '../functions/index.js';

export const description =
  'Schema properties that have the same name should also have the same types.';
export const message = '{{error}}';
export const formats = [oas3];
export const given = schemas;
export const severity = 'off';
export const resolved = true;
export const then = {
  function: propertyConsistentNameAndType,
  functionOptions: {
    excludedProperties: ['code', 'default', 'type', 'value'],
  },
};
