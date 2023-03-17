/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { enumCasingConvention } = require('../functions');

module.exports = {
  description: 'Enum values must follow a specified case convention',
  message: '{{error}}',
  formats: [oas3],
  given: schemas,
  severity: 'error',
  then: {
    function: enumCasingConvention,
    functionOptions: {
      type: 'snake',
    },
  },
};
