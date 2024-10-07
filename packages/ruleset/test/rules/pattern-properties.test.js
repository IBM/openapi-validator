/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { patternProperties } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = patternProperties;
const ruleId = 'ibm-pattern-properties';
const expectedSeverity = severityCodes.error;
const expectedMessage1 = `patternProperties and additionalProperties are mutually exclusive`;
const expectedMessage2 = `patternProperties must be an object`;
const expectedMessage3 = `patternProperties must be a non-empty object`;
const expectedMessage4 = `patternProperties must be an object with at most one entry`;
const expectedMessage5 = `patternProperties patterns should be anchored with ^ and $`;

describe(`Spectral rule: ${ruleId}`, () => {
  beforeAll(() => {
    rootDocument.openapi = '3.1.0';
  });

  describe('Should not yield errors', () => {
    it('Clean spec - no patternProperties', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Valid patternProperties', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas['Movie'].patternProperties = {
        '^str.*$': {
          type: 'string',
        },
      };
      testDocument.components.schemas['Juice'].patternProperties = {
        '^is.*$': {
          type: 'boolean',
        },
      };
      testDocument.components.schemas['Soda'].patternProperties = {
        '^int.*$': {
          type: 'integer',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('patternProperties specified with additionalProperties', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas['Movie'].patternProperties = {
        '^str.*$': {
          type: 'string',
        },
      };
      testDocument.components.schemas['Movie'].additionalProperties = true;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      const expectedPaths = [
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema',
        'paths./v1/movies.post.responses.201.content.application/json.schema',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage1);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('patternProperties is not an object', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas['Movie'].patternProperties = 'foo';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      const expectedPaths = [
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.patternProperties',
        'paths./v1/movies.post.responses.201.content.application/json.schema.patternProperties',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.patternProperties',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.patternProperties',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage2);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('patternProperties is an empty object', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas['Movie'].patternProperties = {};

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      const expectedPaths = [
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.patternProperties',
        'paths./v1/movies.post.responses.201.content.application/json.schema.patternProperties',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.patternProperties',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.patternProperties',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage3);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('patternProperties contains > 1 entry', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas['Movie'].patternProperties = {
        '^str.*$': {
          type: 'string',
        },
        '^bool.*$': {
          type: 'boolean',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      const expectedPaths = [
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.patternProperties',
        'paths./v1/movies.post.responses.201.content.application/json.schema.patternProperties',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.patternProperties',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.patternProperties',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage4);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('patternProperties entry is missing beginning anchor', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas['Movie'].patternProperties = {
        'str.*$': {
          type: 'string',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      const expectedPaths = [
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.patternProperties',
        'paths./v1/movies.post.responses.201.content.application/json.schema.patternProperties',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.patternProperties',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.patternProperties',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage5);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('patternProperties entry is missing ending anchor', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas['Movie'].patternProperties = {
        '^str.*': {
          type: 'string',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      const expectedPaths = [
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.patternProperties',
        'paths./v1/movies.post.responses.201.content.application/json.schema.patternProperties',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.patternProperties',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.patternProperties',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage5);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
