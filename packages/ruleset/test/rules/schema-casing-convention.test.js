/**
 * Copyright 2023 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { schemaCasingConvention } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = schemaCasingConvention;
const ruleId = 'ibm-schema-casing-convention';
const expectedMsg = 'Schema names must be upper camel case';
const expectedSeverity = severityCodes.warning;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('No components', async () => {
      const testDocument = {
        openapi: '3.0',
        paths: {
          '/v1/things': {
            post: {},
          },
        },
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('No schemas', async () => {
      const testDocument = {
        openapi: '3.0',
        paths: {
          '/v1/things': {
            post: {
              requestBody: {
                $ref: '#/components/requestBodies/CreateThingRequest',
              },
            },
          },
        },
        components: {
          requestBodies: {
            CreateThingRequest: {},
          },
        },
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Upper camel case schema name with capitalized acronym', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.IAMCredentialsSecret = {};

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Should handle potential ReDoS patterns efficiently', async () => {
      const testDocument = makeCopy(rootDocument);

      // Pattern that would cause catastrophic backtracking in old regex
      // Old pattern: /^[A-Z]+[a-z0-9]+([A-Z]+[a-z0-9]*)*$/
      // This input would cause exponential time complexity
      const maliciousSchemaName = 'A' + 'Aa'.repeat(50);

      testDocument.components.schemas[maliciousSchemaName] = {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      };

      const startTime = Date.now();
      const results = await testRule(ruleId, rule, testDocument);
      const duration = Date.now() - startTime;

      // Should complete quickly (well under 500ms) with fixed regex
      // Note: Includes test overhead; actual regex execution is much faster
      expect(duration).toBeLessThan(500);
      // Should still validate correctly - this pattern should actually pass
      // as it matches the upper camel case pattern
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Lower camel case schema name', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.movieCollection = {};

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.movieCollection'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Multiple schema names with incorrect casing', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.movieCollection = {};
      testDocument.components.schemas['Drink-Collection'] = {};

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      const expectedPaths = [
        'components.schemas.movieCollection',
        'components.schemas.Drink-Collection',
      ];

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
