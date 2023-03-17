/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { propertyConsistentNameAndType } = require('../functions');

module.exports = {
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
