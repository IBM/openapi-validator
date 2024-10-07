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

let rule;
const ruleId = 'ibm-no-circular-refs';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'API definition should not contain circular references';

describe(`Spectral rule: ${ruleId}`, () => {
  // The implementation of the circular-refs rule uses a global variable
  // to store the set of unique flagged $ref values.
  // Because the global variable's value is retained across testcases, we need to reset
  // everything before each testcase.
  beforeEach(() => {
    jest.resetModules();
    rule = require('../../src/rules').circularRefs;
  });

  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Property named $ref should not cause problems', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Car.properties.$ref = {
        type: 'string',
        description: 'this property is actually called $ref',
      };

      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Circular ref in schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie = {
        $ref: '#/components/schemas/Movie',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.201.content.application/json.schema.$ref'
      );
    });
    it('Circular ref in schema property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.related_movie = {
        $ref: '#/components/schemas/Movie',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.related_movie.$ref'
      );
    });

    it('Circular ref involving two schemas', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.related_movies = {
        $ref: '#/components/schemas/MovieCollection',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.$ref'
      );
      expect(results[1].path.join('.')).toBe(
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.related_movies.$ref'
      );
    });

    it('Circular ref in array "items"', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.related_movies = {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Movie',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.related_movies.items.$ref'
      );
    });

    it('Circular ref in additionalProperties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.additionalProperties = {
        $ref: '#/components/schemas/Movie',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.201.content.application/json.schema.additionalProperties.$ref'
      );
    });

    it('Circular ref in allOf list', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf.push({
        $ref: '#/components/schemas/DrinkCollection',
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.2.$ref'
      );
    });

    it('Circular ref in anyOf list', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Drink = {
        anyOf: [
          {
            $ref: '#/components/schemas/DrinkCollection',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.$ref'
      );
      expect(results[1].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.anyOf.0.$ref'
      );
    });

    it('Circular ref in oneOf list', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Soda.properties.next_drink = {
        $ref: '#/components/schemas/Drink',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema.oneOf.1.properties.next_drink.$ref'
      );
      expect(results[1].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.oneOf.1.$ref'
      );
    });

    it('Circular ref in parameter', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.parameters.DrinkIdParam = {
        $ref: '#/components/parameters/DrinkIdParam',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.parameters.0.$ref'
      );
    });

    it('Circular ref in requestBody', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.requestBodies.CarRequest = {
        $ref: '#/components/requestBodies/CarRequest',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/cars.post.requestBody.$ref'
      );
    });

    it('Circular ref in response', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.responses.CarResponse = {
        $ref: '#/components/responses/CarResponse',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/cars/{car_id}.get.responses.200.$ref'
      );
    });

    it('Circular ref in examples', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.examples.CarExample = {
        $ref: '#/components/examples/CarExample',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/cars.post.requestBody.content.application/json.examples.RequestExample.$ref'
      );
    });

    it('Circular ref in securityScheme', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.securitySchemes.CircularScheme = {
        $ref: '#/components/securitySchemes/CircularScheme',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'components.securitySchemes.CircularScheme.$ref'
      );
    });

    it('Circular ref in link', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.links.CarIdLink = {
        $ref: '#/components/links/CarIdLink',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/cars.post.responses.201.links.CarId.$ref'
      );
    });
  });
});
