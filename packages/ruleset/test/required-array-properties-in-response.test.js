/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { requiredArrayPropertiesInResponse } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = requiredArrayPropertiesInResponse;
const ruleId = 'ibm-required-array-properties-in-response';
const expectedSeverity = severityCodes.error;
const expectedMsg = 'In a response body, an array field MUST NOT be optional';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
    it('Optional array property in request', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add an optional array property to the DrinkPrototype requestBody schema.
      testDocument.components.schemas['DrinkPrototype'].properties = {
        details: {
          type: 'array',
          items: {
            type: 'integer',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Optional array property in response (top-level)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkCollection'].allOf[1].required = [];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Optional array property in response (nested)', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add "metadata" property which is a nested object containing an optional array.
      testDocument.components.schemas['DrinkCollection'].allOf[1].properties[
        'metadata'
      ] = {
        $ref: '#/components/schemas/Metadata',
      };
      testDocument.components.schemas['Metadata'] = {
        type: 'object',
        properties: {
          details: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.metadata.properties.details',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Optional array property in response (array items)', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add an array property "metadata", whose "items" schema is an object containing an optional array.
      testDocument.components.schemas['DrinkCollection'].allOf[1].required.push(
        'metadata'
      );
      testDocument.components.schemas['DrinkCollection'].allOf[1].properties[
        'metadata'
      ] = {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Metadata',
        },
      };
      testDocument.components.schemas['Metadata'] = {
        type: 'object',
        properties: {
          details: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.metadata.items.properties.details',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Optional array property in response (nested allOf)', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add a new allOf element to DrinkCollection which itself is a composed schema
      // with an allOf that defines an optional array.
      testDocument.components.schemas['DrinkCollection'].allOf[2] = {
        type: 'object',
        allOf: [
          {
            type: 'object',
            properties: {
              optional_details: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.2.allOf.0.properties.optional_details',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Optional array property in response (nested anyOf)', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add a new allOf element to DrinkCollection which itself is a composed schema
      // with an allOf that defines an optional array.
      testDocument.components.schemas['DrinkCollection'].allOf[2] = {
        type: 'object',
        anyOf: [
          {
            type: 'object',
            properties: {
              optional_details: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.2.anyOf.0.properties.optional_details',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Optional array property in response (nested oneOf)', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add a new allOf element to DrinkCollection which itself is a composed schema
      // with an allOf that defines an optional array.
      testDocument.components.schemas['DrinkCollection'].allOf[2] = {
        type: 'object',
        oneOf: [
          {
            type: 'object',
            properties: {
              optional_details: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.2.oneOf.0.properties.optional_details',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
