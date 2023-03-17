/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { propertyNameCollision } = require('../functions');

module.exports = {
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
