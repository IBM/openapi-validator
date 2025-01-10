/**
 * Copyright 2024 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { wellDefinedDictionaries } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = wellDefinedDictionaries;
const ruleId = 'ibm-well-defined-dictionaries';
const expectedSeverity = severityCodes.warning;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    // The spec includes scalar values and models,
    // neither of which should trigger warnings with this rule.
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Includes a well-defined dictionary with scalar values (additionalProperties)', async () => {
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

    it('Includes a well-defined dictionary with scalar values (patternProperties)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary mapping keys to string values',
        type: 'object',
        patternProperties: {
          '^[a-zA-Z]+$': {
            type: 'string',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Includes a well-defined dictionary with composed scalar values', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary mapping keys to integer values',
        type: 'object',
        additionalProperties: {
          oneOf: [
            {
              type: 'integer',
              minimum: 0,
              maximum: 10,
            },
            {
              type: 'integer',
              minimum: 20,
              maximum: 30,
            },
          ],
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

    it('Includes a well-defined dictionary of models that include a dictionary property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary mapping keys to string values',
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            nested: {
              type: 'object',
              additionalProperties: {
                type: 'string',
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    const expectedPaths = [
      'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata',
      'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata',
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
          'Object schemas must define either properties, or (additional/pattern)Properties with a concrete type'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Includes a model/dictionary hybrid, which is not allowed (additionalProperties)', async () => {
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

    it('Includes a model/dictionary hybrid, which is not allowed (patternProperties)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary with no definition',
        type: 'object',
        properties: {
          rating: {
            type: 'integer',
          },
        },
        patternProperties: {
          '^[a-zA-Z]+$': {
            type: 'string',
          },
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
          'Dictionary schemas must have a single, well-defined value type'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Includes a dictionary with patternProperties value that has no type', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary with no definition',
        type: 'object',
        patternProperties: {
          '^[a-zA-Z]+$': {
            type: 'string',
          },
          '^wrong_[A-Z][a-z]+$': {
            description: 'no type definition',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Dictionary schemas must have a single, well-defined value type'
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
          'Dictionary schemas must have a single, well-defined value type'
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
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata',
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata',
      ];

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Dictionaries must not have values that are also dictionaries'
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
          'Dictionary schemas must have a single, well-defined value type'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Includes a dictionary of dictionaries, which is not allowed (additionalProperties)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary with no definition',
        type: 'object',
        additionalProperties: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Dictionaries must not have values that are also dictionaries'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Includes a dictionary of dictionaries, which is not allowed (patternProperties)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary with no definition',
        type: 'object',
        patternProperties: {
          '^[a-zA-Z]+$': {
            type: 'object',
            patternProperties: {
              '^[a-zA-Z]+$': {
                type: 'string',
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Dictionaries must not have values that are also dictionaries'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Includes a dictionary of dictionaries, which is not allowed (hybrid)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary with no definition',
        type: 'object',
        patternProperties: {
          '^[a-zA-Z]+$': {
            type: 'object',
            additionalProperties: true,
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Dictionaries must not have values that are also dictionaries'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Flags dictionary of dictionaries but ignores dictionary value issue', async () => {
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

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Dictionaries must not have values that are also dictionaries'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Includes a composed dictionary of dictionaries, which is not allowed', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary with no definition',
        type: 'object',
        additionalProperties: {
          type: 'object',
          allOf: [
            {
              additionalProperties: {
                type: 'string',
              },
            },
            {
              properties: {
                name: {
                  type: 'string',
                },
              },
            },
          ],
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Dictionaries must not have values that are also dictionaries'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Includes a well-defined dictionary of models that include a poorly-defined dictionary property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.metadata = {
        description: 'a dictionary mapping keys to string values',
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            nested: {
              type: 'object',
              additionalProperties: true,
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      const expectedRulePaths = [
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.additionalProperties.properties.nested',
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.additionalProperties.properties.nested',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.additionalProperties.properties.nested',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.additionalProperties.properties.nested',
      ];

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(
          'Dictionary schemas must have a single, well-defined value type'
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedRulePaths[i]);
      }
    });
  });
});
