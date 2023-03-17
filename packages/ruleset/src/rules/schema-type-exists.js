/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { schemaTypeExists } = require('../functions');

module.exports = {
  description:
    'Schemas and schema properties should have a non-empty `type` field. **This rule is disabled by default.**',
  message: '{{error}}',
  given: schemas,
  severity: 'off',
  formats: [oas3],
  resolved: true,
  then: {
    function: schemaTypeExists,
  },
};
