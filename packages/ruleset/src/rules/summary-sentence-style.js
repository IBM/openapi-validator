/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { pattern } = require('@stoplight/spectral-functions');

module.exports = {
  description: 'Operation summaries should not have a trailing period',
  severity: 'warn',
  formats: [oas3],
  resolved: false,
  given: '$.paths[*][*].summary',
  then: {
    function: pattern,
    functionOptions: {
      notMatch: '\\.$',
    },
  },
};
