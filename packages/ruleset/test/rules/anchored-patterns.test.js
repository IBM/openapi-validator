/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { anchoredPatterns } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = anchoredPatterns;
const ruleId = 'ibm-anchored-patterns';
const expectedSeverity = severityCodes.warning;
const expectedMessage = `A regular expression used in a 'pattern' attribute should be anchored with ^ and $`;

// To enable debug logging in the rule function, copy this statement to an it() block:
//    LoggerFactory.getInstance().addLoggerSetting(ruleId, 'debug');
// and uncomment this import statement:
// const LoggerFactory = require('../src/utils/logger-factory');

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Anchored pattern in parameter schema', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'sort',
          in: 'query',
          schema: {
            type: 'string',
            pattern: '^(asc)|(desc)$',
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Anchored pattern used in oneOf', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'ruleTester',
          in: 'query',
          schema: {
            $ref: '#/components/schemas/RuleTester',
          },
        },
      ];

      testDocument.components.schemas['RuleTester'] = {
        type: 'string',
        minLength: 1,
        maxLength: 38,
        oneOf: [
          {
            pattern: '^anchored$',
          },
          {
            pattern: '^another-anchored$',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Anchored pattern used in anyOf', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'ruleTester',
          in: 'query',
          schema: {
            $ref: '#/components/schemas/RuleTester',
          },
        },
      ];

      testDocument.components.schemas['RuleTester'] = {
        type: 'string',
        minLength: 1,
        maxLength: 38,
        anyOf: [
          {
            pattern: '^anchored$',
          },
          {
            pattern: '^another-anchored$',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Anchored pattern used in allOf', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'ruleTester',
          in: 'query',
          schema: {
            $ref: '#/components/schemas/RuleTester',
          },
        },
      ];

      testDocument.components.schemas['RuleTester'] = {
        type: 'string',
        minLength: 1,
        maxLength: 38,
        allOf: [
          {
            pattern: '^anchored$',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Anchored pattern used in string schema', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Soda.properties.name = {
        type: 'string',
        pattern: '^(pepsi)|(coke)|(dr. pepper)$',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Anchored pattern used in additionalProperties schema', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Soda.additionalProperties = {
        type: 'string',
        pattern: '^(pepsi)|(coke)|(dr. pepper)$',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Anchored pattern used in array items schema', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Soda.properties.new_prop = {
        type: 'array',
        items: {
          type: 'string',
          pattern: '^(this)|(that)$',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Unanchored pattern in an integer schema - ignored', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'page_size',
          in: 'query',
          schema: {
            type: 'integer',
            pattern: '12.*00',
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Unanchored pattern in a "not" schema - ignored', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'filter',
          in: 'query',
          schema: {
            type: 'integer',
            not: {
              type: 'string',
              pattern: 'unanchored',
            },
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Unanchored pattern in string schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.UrlString.pattern = 'https://.*';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(6);

      const expectedPaths = [
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.imdb_url.pattern',
        'paths./v1/movies.post.requestBody.content.application/json.schema.properties.imdb_url.pattern',
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.imdb_url.pattern',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.imdb_url.pattern',
        'paths./v1/movies/{movie_id}.put.requestBody.content.application/json.schema.properties.imdb_url.pattern',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.imdb_url.pattern',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Unanchored pattern in array items schema', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Soda.properties.new_prop = {
        type: 'array',
        items: {
          type: 'string',
          pattern: '(this)|(that)',
        },
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.1.properties.new_prop.items.pattern',
        'paths./v1/drinks.post.requestBody.content.application/json.schema.oneOf.1.properties.new_prop.items.pattern',
        'paths./v1/drinks.post.responses.201.content.application/json.schema.oneOf.1.properties.new_prop.items.pattern',
        'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.oneOf.1.properties.new_prop.items.pattern',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Unanchored pattern in additionalProperties schema', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Soda.additionalProperties = {
        type: 'string',
        pattern: 'unanchored',
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.1.additionalProperties.pattern',
        'paths./v1/drinks.post.requestBody.content.application/json.schema.oneOf.1.additionalProperties.pattern',
        'paths./v1/drinks.post.responses.201.content.application/json.schema.oneOf.1.additionalProperties.pattern',
        'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.oneOf.1.additionalProperties.pattern',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Unanchored pattern in allOf', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'ruleTester',
          in: 'query',
          schema: {
            $ref: '#/components/schemas/RuleTester',
          },
        },
      ];

      testDocument.components.schemas['RuleTester'] = {
        type: 'string',
        pattern: '^anchored$',
        allOf: [
          {
            pattern: 'unanchored',
          },
          {
            type: 'string',
            pattern: 'unanchored',
          },
        ],
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      const expectedPaths = [
        'paths./v1/movies.post.parameters.0.schema.allOf.0.pattern',
        'paths./v1/movies.post.parameters.0.schema.allOf.1.pattern',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Unanchored pattern in anyOf', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'ruleTester',
          in: 'query',
          schema: {
            $ref: '#/components/schemas/RuleTester',
          },
        },
      ];

      testDocument.components.schemas['RuleTester'] = {
        type: 'string',
        anyOf: [
          {
            pattern: 'unanchored',
          },
          {
            pattern: '^anchored$',
          },
          {
            pattern: 'another-unanchored',
          },
        ],
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      const expectedPaths = [
        'paths./v1/movies.post.parameters.0.schema.anyOf.0.pattern',
        'paths./v1/movies.post.parameters.0.schema.anyOf.2.pattern',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Unanchored pattern in oneOf', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'ruleTester',
          in: 'query',
          schema: {
            $ref: '#/components/schemas/RuleTester',
          },
        },
      ];

      testDocument.components.schemas['RuleTester'] = {
        oneOf: [
          {
            type: 'string',
            pattern: '^anchored$',
          },
          {
            type: 'string',
            pattern: 'unanchored',
          },
          {
            pattern: 'unanchored',
          },
        ],
      };
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = [
        'paths./v1/movies.post.parameters.0.schema.oneOf.1.pattern',
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessage);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
