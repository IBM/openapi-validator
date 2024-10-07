/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { operationSummaryLength } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = operationSummaryLength;
const ruleId = 'ibm-operation-summary';
const expectedSeverity = severityCodes.error;
const expectedMsg =
  'Operation summaries must be 80 characters or less in length';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Operation has no summary - handled by separate rule', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/drinks'].post.summary;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Operation summary is greater than 80 characters', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.summary =
        'This operation summary for the operation to create a new drink is simply too long';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const r of results) {
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsg);
        expect(r.severity).toBe(expectedSeverity);
        expect(r.path.join('.')).toBe('paths./v1/drinks.post.summary');
      }
    });
  });
});
