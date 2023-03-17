/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  paths,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { etagHeaderExists } = require('../functions');

module.exports = {
  description:
    'ETag response header should be defined in GET operation for resources that support If-Match or If-None-Match header parameters',
  message: '{{error}}',
  given: paths,
  severity: 'error',
  formats: [oas3],
  resolved: true,
  then: {
    function: etagHeaderExists,
  },
};
