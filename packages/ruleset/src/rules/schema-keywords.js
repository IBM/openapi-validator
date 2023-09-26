/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3_1 } = require('@stoplight/spectral-formats');
const { allowedKeywords } = require('../functions');

module.exports = {
  description:
    'Verifies that schema objects include only allowed-listed keywords',
  message: '{{error}}',
  severity: 'error',
  formats: [oas3_1],
  resolved: true,
  given: schemas,
  then: {
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
  },
};
