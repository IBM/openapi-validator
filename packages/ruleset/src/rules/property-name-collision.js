/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { schemas } from '@ibm-cloud/openapi-ruleset-utilities/src/collections';
import { oas3 } from '@stoplight/spectral-formats';
import { propertyNameCollision } from '../functions/index.js';

export default {
  description:
    'Avoid duplicate property names within a schema, even if they differ by case convention',
  message: '{{error}}',
  formats: [oas3],
  given: schemas,
  severity: 'error',
  resolved: true,
  then: {
    function: propertyNameCollision,
  },
};
