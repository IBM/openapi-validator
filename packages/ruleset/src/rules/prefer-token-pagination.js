/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  paths,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { preferTokenPagination } = require('../functions');

module.exports = {
  description:
    'Paginated list operations should use token-based pagination, rather than offset/limit pagination.',
  message: '{{error}}',
  given: paths,
  severity: 'warn',
  formats: [oas3],
  resolved: true,
  then: {
    function: preferTokenPagination,
  },
};
