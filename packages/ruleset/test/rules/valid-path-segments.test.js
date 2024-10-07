/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { validPathSegments } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = validPathSegments;
const ruleId = 'ibm-valid-path-segments';
const expectedSeverity = severityCodes.error;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Multiple parameter references', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}{swig_id}/foo'] =
        testDocument.paths['/v1/drinks/{drink_id}'];
      delete testDocument.paths['/v1/drinks/{drink_id}'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const result = results[0];
      expect(result.code).toBe(ruleId);
      expect(result.severity).toBe(expectedSeverity);
      expect(result.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}{swig_id}/foo'
      );
      expect(results[0].message).toBe(
        'Invalid path parameter reference within path segment: {drink_id}{swig_id}'
      );
    });

    it('Extra characters #1', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/_{drink_id}_/foo'] =
        testDocument.paths['/v1/drinks/{drink_id}'];
      delete testDocument.paths['/v1/drinks/{drink_id}'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const result = results[0];
      expect(result.code).toBe(ruleId);
      expect(result.severity).toBe(expectedSeverity);
      expect(result.path.join('.')).toBe('paths./v1/drinks/_{drink_id}_/foo');
      expect(results[0].message).toBe(
        'Invalid path parameter reference within path segment: _{drink_id}_'
      );
    });

    it('Extra characters #2', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{drink_id}:{swig_id}/foo'] =
        testDocument.paths['/v1/drinks/{drink_id}'];
      delete testDocument.paths['/v1/drinks/{drink_id}'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const result = results[0];
      expect(result.code).toBe(ruleId);
      expect(result.severity).toBe(expectedSeverity);
      expect(result.path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}:{swig_id}/foo'
      );
      expect(results[0].message).toBe(
        'Invalid path parameter reference within path segment: {drink_id}:{swig_id}'
      );
    });
  });
});
