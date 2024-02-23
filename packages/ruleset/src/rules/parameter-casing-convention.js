/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  parameters,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { parameterCasingConvention } = require('../functions');

module.exports = {
  description: 'Parameter names must follow case conventions',
  message: '{{error}}',
  formats: [oas3],
  given: parameters,
  severity: 'error',
  resolved: true,
  then: {
    function: parameterCasingConvention,

    // The configuration of this rule should be an object
    // with keys that represent the different parameter types
    // to be checked for property casing conventions: 'query', 'path', and 'header'.
    // The value of each key should be an object that is either the appropriate
    // configuration needed by Spectral's casing() function OR pattern() function
    // to enforce the desired case convention for parameters of that type.
    // To disable case convention checks for a particular parameter type,
    // simply remove that entry from the config object.
    functionOptions: {
      // Allow snake case for query parameter names,
      // but also allow '.' within the name.
      query: {
        type: 'snake',
        separator: {
          char: '.',
        },
      },

      // Allow snake case for path parameter names.
      path: {
        type: 'snake',
      },

      // Spectral casing convention types aren't robust enough to handle
      // the complexity of headers, so we define our own kebab/pascal case regex.
      header: {
        match: '/^[A-Z]+[a-z0-9]*-*([A-Z]+[a-z0-9]*-*)*$/',
      },

      // Define an alternate message for the header pattern validation
      // to avoid using the default Spectral message.
      headerMessage:
        'Header parameter names must be kebab-separated pascal case',
    },
  },
};
