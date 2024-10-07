/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { pathSegmentCasingConvention } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = pathSegmentCasingConvention;
const ruleId = 'ibm-path-segment-casing-convention';
const expectedSeverity = severityCodes.error;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Empty path segment', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1//drinks//last_seg'] =
        testDocument.paths['/v1/drinks'];
      delete testDocument.paths['/v1/drinks'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Path segments are camel case', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/thisIsATest/drinks/anotherTest'] =
        testDocument.paths['/v1/drinks'];
      delete testDocument.paths['/v1/drinks'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.severity).toBe(expectedSeverity);
        expect(result.path.join('.')).toBe(
          'paths./v1/thisIsATest/drinks/anotherTest'
        );
      }
      expect(results[0].message).toMatch(
        'Path segments must be snake case: thisIsATest'
      );
      expect(results[1].message).toMatch(
        'Path segments must be snake case: anotherTest'
      );
    });
    it('Path segment has a .', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/bad.segment/drinks'] =
        testDocument.paths['/v1/drinks'];
      delete testDocument.paths['/v1/drinks'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Path segments must be snake case: bad.segment'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/bad.segment/drinks');
    });
  });
});
