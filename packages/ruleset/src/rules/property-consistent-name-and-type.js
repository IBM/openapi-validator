/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { propertyConsistentNameAndType } from '../functions/index.js';

export default {
  description:
    'Schema properties that have the same name should also have the same types.',
  message: '{{error}}',
  formats: [oas3],
  given: schemas,
  severity: 'off',
  resolved: true,
  then: {
    function: propertyConsistentNameAndType,
    functionOptions: {
      excludedProperties: ['code', 'default', 'type', 'value'],
    },
  },
};
