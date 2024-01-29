/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { wellDefinedDictionaries } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = wellDefinedDictionaries;
const ruleId = 'ibm-valid-path-segments';
const expectedSeverity = severityCodes.warning;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    // The spec includes scalar values and models,
    // neither of which should trigger warnings with this rule.
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Includes a well-defined dictionary with scalar values', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary mapping keys to string values',
        type: 'object',
        additionalProperties: {
          type: 'string',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Includes a dictionary that nests a well-defined dictionary with scalar values', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary mapping keys to string values',
        type: 'object',
        additionalProperties: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Includes a well-defined composed dictionary schema with scalar values', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        oneOf: [
          {
            description: 'a dictionary mapping keys to string values',
            type: 'object',
            additionalProperties: {
              type: 'string',
              maxLength: 24,
            },
          },
          {
            description: 'a dictionary mapping keys to string values',
            type: 'object',
            additionalProperties: {
              type: 'string',
              maxLength: 42,
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    const expectedPaths = [
      'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata',
      'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata',
      'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata',
      'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata',
    ];

    it('Includes an object with nothing defined', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'an object with no definition',
        type: 'object',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Object schemas must define either properties, or additionalProperties with a concrete type'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Includes a model/dictionary hybrid, which is not allowed', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary with no definition',
        type: 'object',
        properties: {
          rating: {
            type: 'integer',
          },
        },
        additionalProperties: {
          type: 'string',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Object schemas must be either a model or a dictionary - they cannot be both'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Includes a dictionary with additionalProperties set to "true"', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary with no definition',
        type: 'object',
        additionalProperties: true,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Dictionary schemas must have a single, well-defined value type in `additionalProperties`'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Includes a dictionary with additionalProperties set to an empty object', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary with no definition',
        type: 'object',
        additionalProperties: {},
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Dictionary schemas must have a single, well-defined value type in `additionalProperties`'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Includes a nested dictionary with additionalProperties set to "true"', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary with no definition',
        type: 'object',
        additionalProperties: {
          type: 'object',
          additionalProperties: true,
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      const expectedRulePaths = [
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.additionalProperties',
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.additionalProperties',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.additionalProperties',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.additionalProperties',
      ];

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Dictionary schemas must have a single, well-defined value type in `additionalProperties`'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedRulePaths[i]);
      }
    });

    it('Includes a composed dictionary schema with additionalProperties set to true', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        allOf: [
          {
            type: 'object',
            additionalProperties: true,
          },
          {
            description: 'a dictionary with no definition',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Dictionary schemas must have a single, well-defined value type in `additionalProperties`'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
