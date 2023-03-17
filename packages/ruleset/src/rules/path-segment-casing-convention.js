/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  paths,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { pathSegmentCasingConvention } = require('../functions');

module.exports = {
  description: 'Path segments must follow a specified case convention',
  message: '{{error}}',
  formats: [oas3],
  given: paths,
  severity: 'error',
  then: {
    function: pathSegmentCasingConvention,
    functionOptions: {
      type: 'snake',
    },
  },
};
