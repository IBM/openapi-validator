/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { arrayResponses } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = arrayResponses;
const ruleId = 'ibm-no-array-responses';
const expectedSeverity = severityCodes.error;
const expectedMsg =
  'Operations should not return an array as the top-level structure of a response';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Array in inline responses object', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.responses = {
        200: {
          description: 'Good response',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Drink',
                },
              },
            },
            'someother/type': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Drink',
                },
              },
            },
          },
        },
        400: {
          description: 'Error response',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);
      for (const r of results) {
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsg);
        expect(r.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema'
      );
      expect(results[1].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.someother/type.schema'
      );
      expect(results[2].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.400.content.application/json.schema'
      );
    });

    it('Array in referenced responses object', async () => {
      const testDocument = makeCopy(rootDocument);

      // Create a named response with an array schema.
      testDocument.components.responses.DrinksResponse = {
        200: {
          description: 'Good response',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Drink',
                },
              },
            },
          },
        },
      };

      testDocument.paths['/v1/drinks'].get.responses = {
        $ref: '#/components/responses/DrinksResponse',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema'
      );
    });

    it('Array with only "items" field present', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.responses = {
        200: {
          description: 'Good response',
          content: {
            'application/json': {
              schema: {
                items: {
                  $ref: '#/components/schemas/Drink',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const r = results[0];
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(expectedMsg);
      expect(r.severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema'
      );
    });

    it('Excluded operation', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get['x-sdk-exclude'] = true;
      testDocument.paths['/v1/drinks'].get.responses = {
        200: {
          description: 'Good response',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Drink',
                },
              },
            },
          },
        },
        400: {
          description: 'Error response',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      for (const r of results) {
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsg);
        expect(r.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema'
      );
      expect(results[1].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.400.content.application/json.schema'
      );
    });
  });
});
