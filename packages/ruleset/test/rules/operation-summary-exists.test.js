/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { operationSummaryExists } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = operationSummaryExists;
const ruleId = 'ibm-operation-summary';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'Operations must have a non-empty summary';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Operation summary is missing', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/drinks'].post.summary;
      delete testDocument.paths['/v1/movies'].get.summary;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      for (const r of results) {
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsg);
        expect(r.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post');
      expect(results[1].path.join('.')).toBe('paths./v1/movies.get');
    });

    it('Operation summary is empty-string', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.summary = '';
      testDocument.paths['/v1/movies'].get.summary = '';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      for (const r of results) {
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsg);
        expect(r.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post.summary');
      expect(results[1].path.join('.')).toBe('paths./v1/movies.get.summary');
    });

    it('Operation summary is white-space', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.summary = '  ';
      testDocument.paths['/v1/movies'].get.summary = '                  ';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      for (const r of results) {
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsg);
        expect(r.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post.summary');
      expect(results[1].path.join('.')).toBe('paths./v1/movies.get.summary');
    });
  });
});
