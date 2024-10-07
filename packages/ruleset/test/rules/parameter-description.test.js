/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { parameterDescriptionExists } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = parameterDescriptionExists;
const ruleId = 'ibm-parameter-description';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'Parameters should have a non-empty description';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Referenced parameter with no description', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.parameters['VerboseParam'].description;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.get.parameters.0'
      );
    });

    it('Referenced parameter with empty description', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters['VerboseParam'].description = '';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.get.parameters.0'
      );
    });

    it('In-line parameter with only spaces in description', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].get.parameters[0].description = '     ';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.get.parameters.0'
      );
    });

    it('In-line parameter with no description', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/movies'].get.parameters[0].description;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.get.parameters.0'
      );
    });

    it('Deprecated parameter with no description', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.parameters['VerboseParam'].description;
      testDocument.components.parameters['VerboseParam'].deprecated = true;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.get.parameters.0'
      );
    });
  });
});
