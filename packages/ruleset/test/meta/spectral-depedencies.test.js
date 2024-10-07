/**
 * Copyright 2022 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { testRule } = require('../test-utils');

// Test cases for dependencies on subtle and possibly fragile Spectral behavior
describe('Spectral behavior dependencies', () => {
  it('Multiple instances of the same `$ref` in a resolved schema point to the same object', async () => {
    const twoRefsDocument = {
      components: {
        schemas: {
          Parent: {
            properties: {
              one: {
                $ref: '#/components/schemas/Same',
              },
              two: {
                $ref: '#/components/schemas/Same',
              },
            },
          },
          Same: {},
        },
      },
    };

    let ruleWasExecuted = false;
    let resolvedReferencesAreEqual = false;
    const checkReferencesFunction = schema => {
      ruleWasExecuted = true;
      resolvedReferencesAreEqual =
        schema.properties.one === schema.properties.two;
    };

    const resolvedRefsRule = {
      description:
        'Multiple references to the same schema result in the same object',
      message: '{{error}}',
      severity: 'error',
      resolved: true,
      given: '$.components.schemas.Parent',
      then: {
        function: checkReferencesFunction,
      },
    };

    await testRule('resolved-references', resolvedRefsRule, twoRefsDocument);

    expect(ruleWasExecuted).toBe(true);
    expect(resolvedReferencesAreEqual).toBe(true);
  });
});
