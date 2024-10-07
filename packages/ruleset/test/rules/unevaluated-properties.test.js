/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { unevaluatedProperties } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = unevaluatedProperties;
const ruleId = 'ibm-unevaluated-properties';
const expectedSeverity = severityCodes.error;
const expectedMsg = `unevaluatedProperties must be set to false, if present`;

describe(`Spectral rule: ${ruleId}`, () => {
  beforeAll(() => {
    rootDocument.openapi = '3.1.0';
  });

  describe('Should not yield errors', () => {
    it('Clean spec - no unevaluatedProperties', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('unevaluatedProperties set to false', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas['Movie'].unevaluatedProperties = false;
      testDocument.components.schemas['Juice'].unevaluatedProperties = false;
      testDocument.components.schemas['Soda'].unevaluatedProperties = false;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('unevaluatedProperties set to true', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas['Movie'].unevaluatedProperties = true;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);
      const expectedPaths = [
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.unevaluatedProperties',
        'paths./v1/movies.post.responses.201.content.application/json.schema.unevaluatedProperties',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.unevaluatedProperties',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.unevaluatedProperties',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('unevaluatedProperties set to a schema', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas[
        'DrinkCollection'
      ].allOf[1].unevaluatedProperties = {
        type: 'string',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.unevaluatedProperties'
      );
    });
  });
});
