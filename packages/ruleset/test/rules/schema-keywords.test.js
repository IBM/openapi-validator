/**
 * Copyright 2023 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { schemaKeywords } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = schemaKeywords;
const ruleId = 'ibm-schema-keywords';
const expectedSeverity = severityCodes.error;
const expectedMsgPrefix = `Found disallowed keyword:`;

describe(`Spectral rule: ${ruleId}`, () => {
  beforeAll(() => {
    rootDocument.openapi = '3.1.0';
  });

  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('schema with uncommon supported keywords', async () => {
      // This is just a positive test using valid, uncommonly-used keywords.
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties.optionsPackage = {
        type: 'string',
        exclusiveMinimum: true,
        exclusiveMaximum: false,
        minimum: 2,
        maximum: 4,
        minItems: 1,
        maxItems: 10,
        minLength: 1,
        maxLength: 10,
        minProperties: 2,
        maxProperties: 25,
        multipleOf: 13,
        readOnly: true,
        writeOnly: false,
        patternProperties: {
          '.*': {},
        },
        title: 'options_package',
        uniqueItems: 33,
        unevaluatedProperties: false,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('response schema contains "nullable"', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.nullable = true;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.nullable',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(`${expectedMsgPrefix} nullable`);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('requestBody schema contains "$anchor"', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.CarPatch['$anchor'] = 'urn:foo-anchor';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const expectedPaths = [
        'paths./v1/cars/{car_id}.patch.requestBody.content.application/merge-patch+json; charset=utf-8.schema.$anchor',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(`${expectedMsgPrefix} $anchor`);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('schema property contains "$comment"', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.CarPatch.properties.make['$comment'] =
        'This is a comment';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const expectedPaths = [
        'paths./v1/cars/{car_id}.patch.requestBody.content.application/merge-patch+json; charset=utf-8.schema.properties.make.$comment',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(`${expectedMsgPrefix} $comment`);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('allOf element schema contains "examples"', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkCollection.allOf[1].examples = {};

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.examples',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(`${expectedMsgPrefix} examples`);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('"not" schema contains "additionalItems"', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Drink.not = {
        type: 'string',
        additionalItems: 'foo',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);
      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.not.additionalItems',
        'paths./v1/drinks.post.responses.201.content.application/json.schema.not.additionalItems',
        'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.not.additionalItems',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(`${expectedMsgPrefix} additionalItems`);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('oneOf element schema contains "if"', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Drink.oneOf[2] = {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
            description: 'A foo property within a new oneOf element',
          },
        },
        if: {
          type: 'string',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);
      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.2.if',
        'paths./v1/drinks.post.responses.201.content.application/json.schema.oneOf.2.if',
        'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.oneOf.2.if',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(`${expectedMsgPrefix} if`);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('additionalProperties schema contains "then"', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.MovieCollection.additionalProperties = {
        type: 'string',
        then: {
          type: 'object',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const expectedPaths = [
        'paths./v1/movies.get.responses.200.content.application/json.schema.additionalProperties.then',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(`${expectedMsgPrefix} then`);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
