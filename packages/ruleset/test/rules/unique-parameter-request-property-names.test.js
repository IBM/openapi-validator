/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { uniqueParameterRequestPropertyNames } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = uniqueParameterRequestPropertyNames;
const ruleId = 'ibm-unique-parameter-request-property-names';
const expectedSeverity = severityCodes.error;
const expectedMsg = `Name collision detected between operation parameter and requestBody property:`;

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

    it('Path-level params - no collisions', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          name: 'volume',
          in: 'query',
          description: 'The volume of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        description: 'Fruit juice',
        type: 'object',
        required: ['type', 'fruit'],
        properties: {
          type: {
            description: 'The drink type - should be "juice".',
            type: 'string',
            enum: ['juice'],
          },
          fruit: {
            $ref: '#/components/schemas/NormalString',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Operation-level params - no collisions', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.parameters = [
        {
          name: 'color',
          in: 'query',
          description: 'The color of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        description: 'Fruit juice',
        type: 'object',
        required: ['type', 'fruit'],
        properties: {
          type: {
            description: 'The drink type - should be "juice".',
            type: 'string',
            enum: ['juice'],
          },
          fruit: {
            $ref: '#/components/schemas/NormalString',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Path and Operation-level params - no collisions', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          name: 'volume',
          in: 'query',
          description: 'The volume of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.paths['/v1/drinks'].post.parameters = [
        {
          name: 'color',
          in: 'query',
          description: 'The color of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        description: 'Fruit juice',
        type: 'object',
        required: ['type', 'fruit'],
        properties: {
          type: {
            description: 'The drink type - should be "juice".',
            type: 'string',
            enum: ['juice'],
          },
          fruit: {
            $ref: '#/components/schemas/NormalString',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('requestBody schema is an array', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.parameters = [
        {
          name: 'type',
          in: 'query',
          description: 'The type of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        type: 'array',
        items: {
          description: 'Fruit juice',
          type: 'object',
          required: ['type', 'fruit'],
          properties: {
            type: {
              description: 'The drink type - should be "juice".',
              type: 'string',
              enum: ['juice'],
            },
            fruit: {
              $ref: '#/components/schemas/NormalString',
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Readonly property collision', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          name: 'type',
          in: 'query',
          description: 'The type of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
        {
          name: 'fruit',
          in: 'query',
          description: 'The type of fruit used in the drink.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        description: 'Fruit juice',
        type: 'object',
        required: ['type', 'fruit'],
        properties: {
          type: {
            description: 'The drink type.',
            type: 'string',
            readOnly: true,
          },
          fruit: {
            description: 'The type of fruit added to the drink.',
            type: 'string',
            readOnly: true,
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Readonly property collision w/oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.parameters = [
        {
          name: 'type',
          in: 'query',
          description: 'The type of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        description: 'Fruit juice',
        oneOf: [
          {
            type: 'object',
            required: ['type', 'fruit'],
            properties: {
              type: {
                description: 'The drink type - should be "juice".',
                type: 'string',
                enum: ['juice'],
                readOnly: true,
              },
              fruit: {
                $ref: '#/components/schemas/NormalString',
              },
            },
          },
          {
            type: 'object',
            required: ['type', 'fruit'],
            properties: {
              type: {
                description: 'The drink type - should be "juice".',
                type: 'string',
                enum: ['juice'],
                readOnly: true,
              },
              fruit: {
                $ref: '#/components/schemas/NormalString',
              },
              volume: {
                type: 'integer',
              },
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Path-level param collisions', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          name: 'type',
          in: 'query',
          description: 'The type of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
        {
          name: 'fruit',
          in: 'query',
          description: 'The type of fruit used in the drink.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        description: 'Fruit juice',
        type: 'object',
        required: ['type', 'fruit'],
        properties: {
          type: {
            description: 'The drink type - should be "juice".',
            type: 'string',
            enum: ['juice'],
          },
          fruit: {
            $ref: '#/components/schemas/NormalString',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsg} type`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post');
      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(`${expectedMsg} fruit`);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path.join('.')).toBe('paths./v1/drinks.post');
    });

    it('Operation-level param collisions', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.parameters = [
        {
          name: 'type',
          in: 'query',
          description: 'The type of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
        {
          name: 'fruit',
          in: 'query',
          description: 'The type of fruit used in the drink.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        description: 'Fruit juice',
        type: 'object',
        required: ['type', 'fruit'],
        properties: {
          type: {
            description: 'The drink type - should be "juice".',
            type: 'string',
            enum: ['juice'],
          },
          fruit: {
            $ref: '#/components/schemas/NormalString',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsg} type`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post');
      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(`${expectedMsg} fruit`);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path.join('.')).toBe('paths./v1/drinks.post');
    });

    it('Path and Operation-level param collisions', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          name: 'type',
          in: 'query',
          description: 'The type of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.paths['/v1/drinks'].post.parameters = [
        {
          name: 'fruit',
          in: 'query',
          description: 'The type of fruit used in the drink.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        description: 'Fruit juice',
        type: 'object',
        required: ['type', 'fruit'],
        properties: {
          type: {
            description: 'The drink type - should be "juice".',
            type: 'string',
            enum: ['juice'],
          },
          fruit: {
            $ref: '#/components/schemas/NormalString',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsg} type`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post');
      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(`${expectedMsg} fruit`);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path.join('.')).toBe('paths./v1/drinks.post');
    });

    it('Param collisions w/allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          name: 'type',
          in: 'query',
          description: 'The type of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.paths['/v1/drinks'].post.parameters = [
        {
          name: 'fruit',
          in: 'query',
          description: 'The type of fruit used in the drink.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        description: 'Fruit juice',
        type: 'object',
        allOf: [
          {
            properties: {
              type: {
                description: 'The drink type - should be "juice".',
                type: 'string',
                enum: ['juice'],
              },
            },
          },
          {
            properties: {
              fruit: {
                $ref: '#/components/schemas/NormalString',
              },
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsg} type`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post');
      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(`${expectedMsg} fruit`);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path.join('.')).toBe('paths./v1/drinks.post');
    });

    it('Param collisions w/oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.parameters = [
        {
          name: 'type',
          in: 'query',
          description: 'The type of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        description: 'Fruit juice',
        oneOf: [
          {
            type: 'object',
            required: ['type', 'fruit'],
            properties: {
              type: {
                description: 'The drink type - should be "juice".',
                type: 'string',
                enum: ['juice'],
              },
              fruit: {
                $ref: '#/components/schemas/NormalString',
              },
            },
          },
          {
            type: 'object',
            required: ['type', 'fruit'],
            properties: {
              type: {
                description: 'The drink type - should be "juice".',
                type: 'string',
                enum: ['juice'],
              },
              fruit: {
                $ref: '#/components/schemas/NormalString',
              },
              volume: {
                type: 'integer',
              },
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsg} type`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post');
    });

    it('Param collisions w/additionalProperties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          name: 'type',
          in: 'query',
          description: 'The type of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        description: 'Fruit juice',
        type: 'object',
        required: ['type', 'fruit'],
        properties: {
          type: {
            description: 'The drink type - should be "juice".',
            type: 'string',
            enum: ['juice'],
          },
          fruit: {
            $ref: '#/components/schemas/NormalString',
          },
        },
        additionalProperties: true,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsg} type`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post');
    });

    it('Param collisions w/multiple content types', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].parameters = [
        {
          name: 'type',
          in: 'query',
          description: 'The type of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        description: 'Fruit juice',
        type: 'object',
        required: ['type', 'fruit'],
        properties: {
          type: {
            description: 'The drink type - should be "juice".',
            type: 'string',
            enum: ['juice'],
          },
          fruit: {
            $ref: '#/components/schemas/NormalString',
          },
        },
        additionalProperties: true,
      };
      testDocument.paths['/v1/drinks'].post.requestBody.content['text/plain'] =
        {
          schema: {
            type: 'string',
          },
        };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsg} type`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post');
    });

    it('requestBody schema has a discriminator', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.parameters = [
        {
          name: 'type',
          in: 'query',
          description: 'The type of drink to create.',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ];
      testDocument.components.schemas.DrinkPrototype = {
        description: 'Fruit juice',
        type: 'object',
        required: ['type', 'fruit'],
        properties: {
          type: {
            description: 'The drink type - should be "juice".',
            type: 'string',
            enum: ['juice'],
          },
          fruit: {
            $ref: '#/components/schemas/NormalString',
          },
        },
        discriminator: {
          propertyName: 'type',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsg} type`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post');
    });
  });
});
