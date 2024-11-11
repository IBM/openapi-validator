/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { propertyAttributes } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = propertyAttributes;
const ruleId = 'ibm-property-attributes';
const expectedSeverity = severityCodes.error;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    describe('Numeric schemas', () => {
      it('minimum defined by itself', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'integer',
          minimum: 3,
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
      it('maximum defined by itself', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'integer',
          maximum: 3,
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
      it('minimum <= maximum', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'integer',
          minimum: 3,
          maximum: 4,
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
    });

    describe('Object schemas', () => {
      it('minProperties defined by itself', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          minProperties: 3,
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
      it('maxProperties defined by itself', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          maxProperties: 3,
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
      it('minProperties <= maxProperties', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          minProperties: 3,
          maxProperties: 10,
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
    });
  });

  describe('Should yield errors', () => {
    describe('Numeric schemas', () => {
      it('minimum > maximum', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'number',
          format: 'float',
          minimum: 4,
          maximum: 0,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.minimum',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.minimum',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.minimum',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'minimum' cannot be greater than 'maximum'`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
    });

    describe('Non-numeric schemas', () => {
      it('minimum defined for non-numeric schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'string',
          minimum: 4,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.minimum',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.minimum',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.minimum',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'minimum' should not be defined for non-numeric schemas`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('maximum defined for non-numeric schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          maximum: 4,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.maximum',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.maximum',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.maximum',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'maximum' should not be defined for non-numeric schemas`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('multipleOf defined for non-numeric schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          multipleOf: 4,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.multipleOf',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.multipleOf',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.multipleOf',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'multipleOf' should not be defined for non-numeric schemas`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('exclusiveMaximum defined for non-numeric schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          exclusiveMaximum: 4,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.exclusiveMaximum',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.exclusiveMaximum',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.exclusiveMaximum',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'exclusiveMaximum' should not be defined for non-numeric schemas`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('exclusiveMinimum defined for non-numeric schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          exclusiveMinimum: 0,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.exclusiveMinimum',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.exclusiveMinimum',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.exclusiveMinimum',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'exclusiveMinimum' should not be defined for non-numeric schemas`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
    });

    describe('Object schemas', () => {
      it('minProperties > maxProperties', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          minProperties: 5,
          maxProperties: 0,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.minProperties',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.minProperties',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.minProperties',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'minProperties' cannot be greater than 'maxProperties'`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('enum defined for object schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          minProperties: 1,
          maxProperties: 3,
          enum: [{ foo: 'bar' }, { foo: 'bar', baz: 'bat' }],
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.enum',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.enum',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.enum',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'enum' should not be defined for object schemas`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
    });

    describe('Non-object schemas', () => {
      it('minProperties defined for non-object schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'integer',
          minProperties: 3,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.minProperties',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.minProperties',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.minProperties',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'minProperties' should not be defined for non-object schemas`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('maxProperties defined for non-object schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'number',
          format: 'double',
          maxProperties: 3,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.maxProperties',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.maxProperties',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.maxProperties',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'maxProperties' should not be defined for non-object schemas`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('additionalProperties defined for non-object schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'number',
          format: 'double',
          additionalProperties: false,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.additionalProperties',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.additionalProperties',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.additionalProperties',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'additionalProperties' should not be defined for non-object schemas`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('properties defined for non-object schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'number',
          format: 'double',
          properties: {},
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.properties',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.properties',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.properties',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'properties' should not be defined for non-object schemas`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('required defined for non-object schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'number',
          format: 'double',
          required: true,
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.required',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.required',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.required',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'required' should not be defined for non-object schemas`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
    });

    describe('Object schemas', () => {
      it('enum defined for boolean schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['has_wheels'] = {
          type: 'boolean',
          enum: [true, false],
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.has_wheels.enum',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.has_wheels.enum',
          'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.has_wheels.enum',
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            `'enum' should not be defined for boolean schemas`
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
    });
  });
});
