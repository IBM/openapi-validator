/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { propertyAttributes } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = propertyAttributes;
const ruleId = 'ibm-property-attributes';
const expectedSeverity = severityCodes.error;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    describe('Numeric schema tests', () => {
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

    describe('Object schema tests', () => {
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
    describe('Numeric schema tests', () => {
      it('minimum > maximum', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'integer',
          minimum: 4,
          maximum: 3,
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
    });

    describe('Object schema tests', () => {
      it('minProperties > maxProperties', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          minProperties: 5,
          maxProperties: 4,
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
    });
  });
});
