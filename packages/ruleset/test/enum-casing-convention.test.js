/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { enumCasingConvention } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = enumCasingConvention;
const ruleId = 'ibm-enum-casing-convention';
const expectedSeverity = severityCodes.error;
const expectedMsg = 'Enum values must be snake case';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Valid snake case enum value', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].get.parameters[0].schema.enum = [
        'snake_case_value',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Parameter schema with non-snake case enum values', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].get.parameters[0].schema.enum = [
        'valueOne',
        'valueTwo',
        'value_three',
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.get.parameters.0.schema.enum.0'
      );
      expect(results[1].path.join('.')).toBe(
        'paths./v1/movies.get.parameters.0.schema.enum.1'
      );
    });

    it('Schema property with non-snake case enum values', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Juice'].properties['type'].enum = [
        'juicyJuice',
        'not_enough_juice',
        'orangeJuice',
      ];

      const results = await testRule(ruleId, rule, testDocument);

      // We should receive 2 errors because the Juice schema is used within the Drink schema,
      // which is referenced in two places.
      expect(results).toHaveLength(8);

      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsg);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema.oneOf.0.properties.type.enum.0'
      );
      expect(results[1].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema.oneOf.0.properties.type.enum.2'
      );
      expect(results[2].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.oneOf.0.properties.type.enum.0'
      );
      expect(results[3].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.oneOf.0.properties.type.enum.2'
      );
      expect(results[4].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.0.properties.type.enum.0'
      );
      expect(results[5].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.0.properties.type.enum.2'
      );
      expect(results[6].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.oneOf.0.properties.type.enum.0'
      );
      expect(results[7].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.oneOf.0.properties.type.enum.2'
      );
    });
  });
});
