/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');
const { noNullableProperties } = require('../../src/rules');

const rule = noNullableProperties;
const ruleId = 'ibm-no-nullable-properties';
const expectedSeverity = severityCodes.warning;
const expectedMsg =
  'nullable properties should be defined only within a JSON merge-patch request body schema';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.CarPatch.properties.make.nullable = true;

      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
    it('nullable specified without a corresponding type value', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties.make.nullable = true;
      delete testDocument.components.schemas.Car.properties.make.type;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('nullable property in non-patch request/response (type is a string)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties.make.nullable = true;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);
      const expectedPaths = [
        'paths./v1/cars.post.responses.201.content.application/json.schema.properties.make',
        'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.make',
        'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.make',
      ];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('property contains null in type array', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.openapi = '3.1.0';
      testDocument.components.schemas.Car.properties.make.type = [
        'string',
        'null',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);
      const expectedPaths = [
        'paths./v1/cars.post.responses.201.content.application/json.schema.properties.make',
        'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.make',
        'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.make',
      ];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('nullable used in parameter schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters.VerboseParam.schema.nullable = true;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const expectedPaths = [
        'paths./v1/drinks/{drink_id}.get.parameters.0.schema',
      ];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('nullable used in oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Soda.properties.type.nullable = true;
      testDocument.components.schemas.Juice.properties.type.nullable = true;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(8);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.0.properties.type',
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.1.properties.type',
        'paths./v1/drinks.post.requestBody.content.application/json.schema.oneOf.0.properties.type',
        'paths./v1/drinks.post.requestBody.content.application/json.schema.oneOf.1.properties.type',
        'paths./v1/drinks.post.responses.201.content.application/json.schema.oneOf.0.properties.type',
        'paths./v1/drinks.post.responses.201.content.application/json.schema.oneOf.1.properties.type',
        'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.oneOf.0.properties.type',
        'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.oneOf.1.properties.type',
      ];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('nullable used in allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[1].properties.drinks.nullable = true;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks',
      ];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('nullable used in allOf (type is an array)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[1].properties.drinks.type =
        ['array', 'null'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks',
      ];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('nullable used in additionalProperties (string schema)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.additionalProperties = {
        type: 'string',
        nullable: true,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);
      const expectedPaths = [
        'paths./v1/cars.post.responses.201.content.application/json.schema.additionalProperties',
        'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.additionalProperties',
        'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.additionalProperties',
      ];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('nullable used in additionalProperties (object schema)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.additionalProperties = {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            nullable: true,
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);
      const expectedPaths = [
        'paths./v1/cars.post.responses.201.content.application/json.schema.additionalProperties.properties.foo',
        'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.additionalProperties.properties.foo',
        'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.additionalProperties.properties.foo',
      ];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('patternProperties schema contains type array that includes "null")', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.openapi = '3.1.0';
      testDocument.components.schemas.Car.patternProperties = {
        foo: {
          type: 'object',
          properties: {
            foo: {
              type: ['string', 'null'],
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);
      const expectedPaths = [
        'paths./v1/cars.post.responses.201.content.application/json.schema.patternProperties.foo.properties.foo',
        'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.patternProperties.foo.properties.foo',
        'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.patternProperties.foo.properties.foo',
      ];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
