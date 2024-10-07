/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { noUnsupportedKeywords } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = noUnsupportedKeywords;
const ruleId = 'ibm-no-unsupported-keywords';
const expectedSeverity = severityCodes.error;
const expectedMsgPrefix =
  'An unsupported OpenAPI 3.1 keyword was found in the OpenAPI document:';

describe(`Spectral rule: ${ruleId}`, () => {
  beforeAll(() => {
    rootDocument.openapi = '3.1.0';
  });

  describe('Should not yield errors', () => {
    it('Clean spec - no unsupported keywords present', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('jsonSchemaDialect present', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.jsonSchemaDialect =
        'https://spec.openapis.org/oas/3.1/dialect/base';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['jsonSchemaDialect'];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} jsonSchemaDialect`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('webhooks present', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.webhooks = {
        newDrinkAvailable: {
          post: {
            requestBody: {
              description: 'A new brand of beer is available for consumption.',
              content: {
                'application/beer': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['webhooks'];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(`${expectedMsgPrefix} webhooks`);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
