/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { refSiblingDuplicateDescription } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = refSiblingDuplicateDescription;
const ruleId = 'ibm-no-duplication-description-with-ref-sibling';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'Duplicate ref-sibling description is unnecessary';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
    it('Duplicate description overridden', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.TokenPaginationBase.properties.last = {
        allOf: [
          {
            $ref: '#/components/schemas/PageLink',
          },
          {
            description: testDocument.components.schemas.PageLink.description,
          },
          {
            description: 'Not a duplicate',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Duplicate description inside allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.TokenPaginationBase.properties.last = {
        allOf: [
          {
            $ref: '#/components/schemas/PageLink',
          },
          {
            description: testDocument.components.schemas.PageLink.description,
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);

      // The second result is for list movies, which also uses the PageLink schema.
      // This applies to all tests below, as well.
      expect(results).toHaveLength(2);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.0.properties.last'
      );
    });
    it('Duplicate description inside allOf multiple', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.TokenPaginationBase.properties.last = {
        allOf: [
          {
            $ref: '#/components/schemas/PageLink',
          },
          {
            description: 'foo',
          },
          {
            description: testDocument.components.schemas.PageLink.description,
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.0.properties.last'
      );
    });
    it('Duplicate description outside allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.TokenPaginationBase.properties.last = {
        allOf: [
          {
            $ref: '#/components/schemas/PageLink',
          },
        ],
        description: testDocument.components.schemas.PageLink.description,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.0.properties.last'
      );
    });
  });
});
