/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { integerAttributes } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = integerAttributes;
const ruleId = 'ibm-integer-attributes';
const expectedSeverity = severityCodes.error;

// To enable debug logging in the rule function, copy this statement to an it() block:
//    LoggerFactory.getInstance().addLoggerSetting(ruleId, 'debug');
// and uncomment this import statement:
// const LoggerFactory = require('../../src/utils/logger-factory');

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
    it('Integer schema is in a not', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'filter',
          in: 'query',
          schema: {
            type: 'string',
            not: {
              type: 'integer',
            },
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Integer schema specifies minimum in oneOf schemas', async () => {
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
        description: 'Tests minimum field within oneOf',
        type: 'integer',
        format: 'int64',
        maximum: 10,
        oneOf: [
          {
            minimum: 0,
          },
          {
            minimum: 1,
          },
          {
            minimum: 2,
          },
        ],
        example: 7,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Integer schema specifies fields in allOf schemas', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'ruleTester1',
          in: 'query',
          schema: {
            $ref: '#/components/schemas/RuleTester1',
          },
        },
        {
          name: 'ruleTester2',
          in: 'query',
          schema: {
            $ref: '#/components/schemas/RuleTester2',
          },
        },
      ];

      testDocument.components.schemas['RuleTester1'] = {
        description: 'Tests integer fields within allOf',
        type: 'integer',
        allOf: [
          {
            minimum: 0,
          },
          {
            maximum: 99,
          },
          {
            format: 'int32',
          },
        ],
        example: 98,
      };
      testDocument.components.schemas['RuleTester2'] = {
        description: 'Tests integer fields within allOf',
        type: ['integer'],
        format: 'int32',
        allOf: [
          {
            minimum: 1,
          },
          {
            maximum: 38,
          },
        ],
        example: 38,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Integer schema is missing a `maximum` field', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'max_movie_length',
          in: 'query',
          schema: {
            type: 'integer',
            format: 'int32',
            minimum: 1,
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['paths./v1/movies.post.parameters.0.schema'];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Integer schema is missing a `minimum` field', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'max_movie_length',
          in: 'query',
          schema: {
            type: 'integer',
            format: 'int64',
            maximum: 720,
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['paths./v1/movies.post.parameters.0.schema'];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Integer schema has invalid format', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'max_movie_length',
          in: 'query',
          schema: {
            type: 'integer',
            format: 'int128',
            minimum: 0,
            maximum: 720,
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['paths./v1/movies.post.parameters.0.schema'];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Integer schema is missing a `minimum` field (allOf)', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'max_movie_length',
          in: 'query',
          schema: {
            type: 'integer',
            format: 'int32',
            allOf: [{ maximum: 10 }, { maximum: 25 }],
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['paths./v1/movies.post.parameters.0.schema'];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Integer schema is missing a `maximum` field (nested oneOf)', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'max_movie_length',
          in: 'query',
          schema: {
            type: 'integer',
            format: 'int32',
            allOf: [
              {
                oneOf: [{ minimum: 0 }, { minimum: 3 }],
              },
              { minimum: 2 },
            ],
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['paths./v1/movies.post.parameters.0.schema'];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Integer schema w/invalid format (nested anyOf)', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'max_movie_length',
          in: 'query',
          schema: {
            type: 'integer',
            maximum: 38,
            minimum: 0,
            allOf: [
              {
                anyOf: [{ format: 'int8' }, { format: 'int16' }],
              },
              { format: 'int99' },
            ],
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['paths./v1/movies.post.parameters.0.schema'];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Integer schema w/minimum > maximum', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'max_movie_length',
          in: 'query',
          schema: {
            type: 'integer',
            format: 'int64',
            allOf: [{ minimum: 10 }, { maximum: 9 }],
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['paths./v1/movies.post.parameters.0.schema'];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].message).toBe(
          `'minimum' cannot be greater than 'maximum'`
        );
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Invalid integer schema defined at path level', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].parameters = [
        {
          name: 'integer_param',
          in: 'query',
          schema: {
            type: ['integer'],
            format: 'int32',
            minimum: 16,
            maximum: 15,
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['paths./v1/movies.parameters.0.schema'];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].message).toBe(
          `'minimum' cannot be greater than 'maximum'`
        );
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Integer schema specifies maximum in only SOME oneOf schemas', async () => {
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
        description: 'Tests maximum field within oneOf',
        type: 'integer',
        format: 'int64',
        minimum: 1,
        oneOf: [
          {
            maximum: 38,
          },
          {
            maximum: 42,
          },
          {
            description: 'No maximum field in this schema',
          },
        ],
        example: 36,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['paths./v1/movies.post.parameters.0.schema'];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].message).toBe(
          `Integer schemas should define property 'maximum'`
        );
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Response body integer schema has no keywords', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies/{movie_id}'].get.responses['200'] = {
        content: {
          'application/json': {
            schema: {
              properties: {
                size: {
                  type: 'integer',
                  format: 'int32',
                  description: 'no validation',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      const expectedPath =
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.size';
      const expectedMessages = [
        `Integer schemas should define property 'minimum'`,
        `Integer schemas should define property 'maximum'`,
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessages[i]);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPath);
      }
    });
    it('Response header integer schema has no keywords', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.responses['MovieWithETag'].headers[
        'X-IBM-Something'
      ] = {
        schema: {
          type: 'integer',
          format: 'int32',
          description: 'no validation',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      const expectedPaths = [
        'paths./v1/movies/{movie_id}.get.responses.200.headers.X-IBM-Something.schema',
        'paths./v1/movies/{movie_id}.get.responses.200.headers.X-IBM-Something.schema',
        'paths./v1/movies/{movie_id}.put.responses.200.headers.X-IBM-Something.schema',
        'paths./v1/movies/{movie_id}.put.responses.200.headers.X-IBM-Something.schema',
      ];
      const expectedMessages = [
        `Integer schemas should define property 'minimum'`,
        `Integer schemas should define property 'maximum'`,
        `Integer schemas should define property 'minimum'`,
        `Integer schemas should define property 'maximum'`,
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessages[i]);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('Integer schema int32 minimum is out of safe range', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'max_movie_length',
          in: 'query',
          schema: {
            type: 'integer',
            format: 'int32',
            minimum: -9007199254740991,
            maximum: 2147483649,
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      const expectedPath = 'paths./v1/movies.post.parameters.0.schema';

      const expectedMessages = [
        `'minimum' value is out of safe range`,
        `'maximum' value is out of safe range`,
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessages[i]);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPath);
      }
    });
    it('Integer schema int64 minimum is out of safe range', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'max_movie_length',
          in: 'query',
          schema: {
            type: 'integer',
            format: 'int64',
            minimum: -9007199254740992,
            maximum: 9007199254740992,
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      const expectedPath = 'paths./v1/movies.post.parameters.0.schema';

      const expectedMessages = [
        `'minimum' value is out of safe range`,
        `'maximum' value is out of safe range`,
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessages[i]);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPath);
      }
    });
    it('Integer schema doesnt have format defined', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'max_movie_length',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 2,
            maximum: 3,
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPath = 'paths./v1/movies.post.parameters.0.schema';

      const expectedMessage = 'Integer schemas should specify format as one of';

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toContain(expectedMessage);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPath);
      }
    });
  });
});
