/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { requiredEnumPropertiesInResponse } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = requiredEnumPropertiesInResponse;
const ruleId = 'ibm-required-enum-properties-in-response';
const expectedSeverity = severityCodes.error;
const expectedMsg = 'In a response body, an enumeration field MUST be required';

// To enable debug logging in the rule function, copy this statement to an it() block:
//    LoggerFactory.getInstance().addLoggerSetting(ruleId, 'debug');
// and uncomment this import statement:
// const LoggerFactory = require('../src/utils/logger-factory');

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
    it('Optional enum property in a request schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkPrototype'].properties = {
        drink_category: {
          type: 'string',
          enum: ['whiskey', 'chaser', 'beer', 'soda'],
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Required enum property in allOf w/o required field', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkCollection'].allOf[2] = {
        type: 'object',
        properties: {
          drink_category: {
            type: 'string',
            enum: ['whiskey', 'chaser', 'beer', 'soda'],
          },
        },
      };
      testDocument.components.schemas['DrinkCollection'].required = [
        'drink_category',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Required enum property in allOf w/required field', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkCollection'].allOf[2] = {
        type: 'object',
        required: ['drink_category'],
        properties: {
          drink_category: {
            type: 'string',
            enum: ['whiskey', 'chaser', 'beer', 'soda'],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Required array property in nested allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkCollection'].allOf[2] = {
        type: 'object',
        required: ['drink_category'],
        allOf: [
          {
            type: 'object',
            required: ['foo'],
            allOf: [
              {
                type: 'object',
                allOf: [
                  {
                    properties: {
                      drink_category: {
                        type: 'string',
                        enum: ['whiskey', 'chaser', 'beer', 'soda'],
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Optional enum property in response (top-level)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkCollection'].allOf.push({
        type: 'object',
        required: ['foo'],
        properties: {
          drink_category: {
            type: 'string',
            enum: ['whiskey', 'chaser', 'beer', 'soda'],
          },
          foo: {
            type: 'string',
          },
        },
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.2.properties.drink_category',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Optional enum property in response (nested object)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkCollection'].allOf[1].properties[
        'metadata'
      ] = {
        $ref: '#/components/schemas/Metadata',
      };
      testDocument.components.schemas['Metadata'] = {
        type: 'object',
        properties: {
          drink_category: {
            type: 'string',
            enum: ['whiskey', 'chaser', 'beer', 'soda'],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.metadata.properties.drink_category',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Optional enum property in response (array items)', async () => {
      const testDocument = makeCopy(rootDocument);

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
          drink_category: {
            type: 'string',
            enum: ['whiskey', 'chaser', 'beer', 'soda'],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.metadata.items.properties.drink_category',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Optional enum property in response (additionalProperties)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkCollection'].additionalProperties =
        {
          $ref: '#/components/schemas/Metadata',
        };
      testDocument.components.schemas['Metadata'] = {
        type: 'object',
        properties: {
          drink_category: {
            type: 'string',
            enum: ['whiskey', 'chaser', 'beer', 'soda'],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.additionalProperties.properties.drink_category',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Optional enum property in response (nested allOf)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkCollection'].allOf[2] = {
        type: 'object',
        allOf: [
          {
            type: 'object',
            properties: {
              drink_category: {
                type: 'string',
                enum: ['whiskey', 'chaser', 'beer', 'soda'],
              },
              foo: {
                type: 'string',
              },
            },
            required: ['foo'],
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.2.allOf.0.properties.drink_category',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Optional enum property in response (nested anyOf)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkCollection'].allOf[2] = {
        type: 'object',
        anyOf: [
          {
            type: 'object',
            properties: {
              drink_category: {
                type: 'string',
                enum: ['whiskey', 'chaser', 'beer', 'soda'],
              },
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.2.anyOf.0.properties.drink_category',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Optional enum property in response (nested oneOf)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkCollection'].allOf[2] = {
        type: 'object',
        oneOf: [
          {
            type: 'object',
            properties: {
              drink_category: {
                type: 'string',
                enum: ['whiskey', 'chaser', 'beer', 'soda'],
              },
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.2.oneOf.0.properties.drink_category',
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
