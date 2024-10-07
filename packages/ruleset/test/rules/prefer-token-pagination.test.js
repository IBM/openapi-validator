/**
 * Copyright 2023 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { preferTokenPagination } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
  helperArtifacts,
} = require('../test-utils');
const { offsetPaginationBase, offsetParameter } = helperArtifacts;

const rule = preferTokenPagination;
const ruleId = 'ibm-prefer-token-pagination';
const expectedSeverity = severityCodes.warning;
const expectedMsg =
  'Token-based pagination is recommended over offset/limit pagination';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Warn for paginated operation with offset/limit style pagination', async () => {
      const testDocument = makeCopy(rootDocument);

      // Set up offset/limit pagination
      testDocument.paths['/v1/drinks'].get.parameters[0] =
        makeCopy(offsetParameter);
      testDocument.components.schemas.DrinkCollection.allOf[0] =
        makeCopy(offsetPaginationBase);

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(r.path.join('.')).toBe('paths./v1/drinks.get');
    });
  });
});
