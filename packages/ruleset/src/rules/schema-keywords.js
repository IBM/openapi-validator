/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { allowedKeywords } from '../functions/index.js';
import spectralFormats from '@stoplight/spectral-formats'
const { oas3_1 } = spectralFormats;

export const description =
  'Verifies that schema objects include only allowed-listed keywords';
export const message = '{{error}}';
export const severity = 'error';
export const formats = [oas3_1];
export const resolved = true;
export const given = schemas;
export const then = {
  function: allowedKeywords,
  functionOptions: {
    keywordAllowList: [
      '$ref',
      'additionalProperties',
      'allOf',
      'anyOf',
      'default',
      'description',
      'discriminator',
      'enum',
      'example',
      'examples',
      'exclusiveMaximum',
      'exclusiveMinimum',
      'format',
      'items',
      'maximum',
      'maxItems',
      'maxLength',
      'maxProperties',
      'minimum',
      'minItems',
      'minLength',
      'minProperties',
      'multipleOf',
      'not',
      'oneOf',
      'pattern',
      'patternProperties',
      'properties',
      'readOnly',
      'required',
      'title',
      'type',
      'uniqueItems',
      'unevaluatedProperties',
      'writeOnly',
    ],
  },
};
