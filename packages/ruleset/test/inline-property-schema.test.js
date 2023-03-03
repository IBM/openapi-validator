/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { inlinePropertySchema } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = inlinePropertySchema;
const ruleId = 'ibm-inline-property-schema';
const expectedSeverity = severityCodes.warning;
const expectedMsg =
  'Nested objects should be defined as a $ref to a named schema.';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline object schema w/no properties', async () => {
      const testDocument = makeCopy(rootDocument);

      // empty object
      testDocument.components.schemas.Car.properties['inline_prop1'] = {
        type: 'object'
      };

      // any object
      testDocument.components.schemas.Car.properties['inline_prop2'] = {
        type: 'object',
        additionalProperties: true
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline object schema w/annotation but no properties', async () => {
      const testDocument = makeCopy(rootDocument);

      // empty object
      testDocument.components.schemas.Car.properties['inline_prop1'] = {
        'type': 'object',
        'x-foo': 'bar'
      };

      // any object
      testDocument.components.schemas.Car.properties['inline_prop2'] = {
        'type': 'object',
        'additionalProperties': true,
        'x-terraform-sensitive': 'bar'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Ref sibling', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        allOf: [
          {
            $ref: '#/components/schemas/CarPatch'
          },
          {
            description: 'An instance of a patched car.'
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Composed primitive schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        oneOf: [
          {
            type: 'string'
          },
          {
            type: 'string'
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Schema property defined with inline object schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        type: 'object',
        properties: {
          nested_prop: {
            type: 'string'
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop'
      );
    });

    it('Inline object in allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        allOf: [
          {
            properties: {
              nested_prop: {
                type: 'string'
              }
            }
          },
          {
            description: 'A nested property.'
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop'
      );
    });

    it('Inline object in anyOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        anyOf: [
          {
            description: 'A nested property.',
            properties: {
              nested_prop: {
                type: 'string'
              }
            }
          },
          {
            description: 'An alternative string representation.',
            type: 'string'
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop'
      );
      expect(results[1].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop.anyOf.0'
      );
    });

    it('Inline object in oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        oneOf: [
          {
            description: 'An alternative string representation.',
            type: 'string'
          },
          {
            description: 'A nested property.',
            properties: {
              nested_prop: {
                type: 'string'
              }
            }
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop'
      );
      expect(results[1].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop.oneOf.1'
      );
    });

    it('Inline object in array items', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_array_prop'] = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            element: {
              type: 'string'
            }
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_array_prop.items'
      );
    });

    it('Inline object in additionalProperties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.additionalProperties = {
        description: 'Inline object schema within additionalProperties',
        properties: {
          prop1: {
            type: 'string'
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.additionalProperties'
      );
    });

    it('Inline composed schema in additionalProperties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        allOf: [
          {
            $ref: '#/components/schemas/Drink'
          },
          {
            $ref: '#/components/schemas/Car'
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop'
      );
    });

    it('Inline composed schema via oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.additionalProperties = {
        oneOf: [
          {
            $ref: '#/components/schemas/Drink'
          },
          {
            description:
              'This is an alternate description for the Drink schema.'
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.additionalProperties'
      );
      expect(results[1].path.join('.')).toBe(
        'components.schemas.Car.additionalProperties.oneOf.1'
      );
    });

    it('Inline composed schema with altered required properties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.additionalProperties = {
        allOf: [
          {
            $ref: '#/components/schemas/Drink'
          },
          {
            required: ['type']
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.additionalProperties'
      );
    });
  });
});
