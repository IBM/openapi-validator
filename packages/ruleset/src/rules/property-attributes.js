/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { propertyAttributes } = require('../functions');

module.exports = {
  description:
    'Performs checks on specific attributes of a schema or schema property',
  message: '{{error}}',
  given: schemas,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: propertyAttributes,
  },
};
