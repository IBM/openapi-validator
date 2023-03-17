/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { discriminatorPropertyExists } = require('../functions');

module.exports = {
  description: 'The discriminator property name must be defined in this schema',
  message: '{{error}}',
  given: schemas,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: discriminatorPropertyExists,
  },
};
