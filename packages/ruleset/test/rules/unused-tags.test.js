/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { unusedTags } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = unusedTags;
const ruleId = 'ibm-openapi-tags-used';
const expectedSeverity = severityCodes.warning;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Unreferenced tag', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.tags.push({ name: 'UnusedTag' });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'A tag is defined but never used: UnusedTag'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('tags.1');
    });
  });
});
