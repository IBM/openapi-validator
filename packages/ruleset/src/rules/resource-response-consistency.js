/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const { resourceResponseConsistency } = require('../functions');

module.exports = {
  description:
    'Operations that create or update a resource should return the same schema as the "GET" request for the resource.',
  message: '{{error}}',
  formats: [oas3],
  given: [`$.paths[*][put,post,patch]`],
  severity: 'warn',
  resolved: true,
  then: {
    function: resourceResponseConsistency,
  },
};
