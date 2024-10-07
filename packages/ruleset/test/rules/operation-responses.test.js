/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { operationResponses } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = operationResponses;
const ruleId = 'ibm-operation-responses';
const expectedSeverity = severityCodes.error;
const expectedMsg = 'Operations MUST have a "responses" field';

describe(`Spectral rule: ${ruleId}`, () => {
  beforeAll(() => {
    rootDocument.openapi = '3.1.0';
  });

  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('No responses', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/drinks'].post.responses;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const expectedPaths = ['paths./v1/drinks.post'];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
