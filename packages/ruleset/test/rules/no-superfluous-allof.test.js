/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { noSuperfluousAllOf } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = noSuperfluousAllOf;
const ruleId = 'ibm-no-superfluous-allof';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'Avoid schemas containing only a single-element allOf';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
    it('allOf along with other attributes', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Drink = {
        description: 'description',
        allOf: [
          {
            $ref: '#/components/schemas/Juice',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('allOf with 2 or more elements', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Drink = {
        description: 'description',
        allOf: [
          {
            $ref: '#/components/schemas/Juice',
          },
          {
            $ref: '#/components/schemas/Soda',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Single-element allOf with no other attributes', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Drink = {
        allOf: [
          {
            $ref: '#/components/schemas/Juice',
          },
        ],
      };

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items',
        'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema',
        'paths./v1/drinks.post.responses.201.content.application/json.schema',
      ];

      const results = await testRule(ruleId, rule, testDocument);

      expect(results).toHaveLength(3);
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Superfluous allOf in nested oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Juice = {
        oneOf: [
          {
            allOf: [
              {
                $ref: '#/components/schemas/NormalString',
              },
            ],
          },
        ],
      };

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.0.oneOf.0',
        'paths./v1/drinks.post.requestBody.content.application/json.schema.oneOf.0.oneOf.0',
        'paths./v1/drinks.post.responses.201.content.application/json.schema.oneOf.0.oneOf.0',
        'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.oneOf.0.oneOf.0',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
