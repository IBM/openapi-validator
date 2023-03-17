/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  paths,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { duplicatePathParameter } = require('../functions');

module.exports = {
  description: 'Common path parameters should be defined on the path object.',
  given: paths,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: duplicatePathParameter,
  },
};
