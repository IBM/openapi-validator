/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { propertyDescriptionExists } = require('../functions');

module.exports = {
  description: 'Schema properties should have a non-empty description',
  message: '{{error}}',
  given: schemas,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: propertyDescriptionExists,
  },
};
