/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { requiredArrayPropertiesInResponse } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = requiredArrayPropertiesInResponse;
const ruleId = 'ibm-required-array-properties-in-response';
const expectedSeverity = severityCodes.error;
const expectedMsg = 'In a response body, an array field MUST NOT be optional';

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
    it('Optional array property in a request schema', async () => {
      const testDocument = makeCopy(rootDocument);

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
    it('Required array property in allOf w/required in parent', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkCollection'].allOf[2] = {
        type: 'object',
        properties: {
          optional_details: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      };
      testDocument.components.schemas['DrinkCollection'].required = [
        'optional_details',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Required array property in allOf w/required field', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkCollection'].allOf[2] = {
        type: 'object',
        required: ['optional_details'],
        properties: {
          optional_details: {
            type: 'array',
            items: {
              type: 'string',
            },
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
        required: ['optional_details'],
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
                      optional_details: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
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
    it('Optional array property in response (nested object)', async () => {
      const testDocument = makeCopy(rootDocument);

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
    it('Optional array property in response (additionalProperties)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['DrinkCollection'].additionalProperties =
        {
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
        'paths./v1/drinks.get.responses.200.content.application/json.schema.additionalProperties.properties.details',
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
