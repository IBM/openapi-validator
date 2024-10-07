/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { parameterDefault } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = parameterDefault;
const ruleId = 'ibm-no-default-for-required-parameter';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'Required parameters should not define a default value';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Optional parameter with default', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters['VerboseParam'].schema.default = true;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Referenced required parameter with default', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters['DrinkIdParam'].schema.default = 'foo';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.parameters.0'
      );
    });

    it('Inline required parameter with default', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].get.parameters[0].required = true;
      testDocument.paths['/v1/movies'].get.parameters[0].schema.default = 'foo';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.get.parameters.0'
      );
    });
  });
});
