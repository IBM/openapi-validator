/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { serverVariableDefaultValue } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-server-variable-default-value';
const rule = serverVariableDefaultValue;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(ruleId, rule, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should error if a server variable doesnt have a default value', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.servers = [
      {
        url: 'https://example.com',
        variables: {
          name: {
            description: 'this variable should have a non-empty default value',
            default: '',
          },
        },
      },
    ];

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Server variable should have default value'
    );
    expect(validation.path).toStrictEqual([
      'servers',
      '0',
      'variables',
      'name',
      'default',
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
