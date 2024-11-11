/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { stringAttributes } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = stringAttributes;
const ruleId = 'ibm-string-attributes';
const expectedSeverity = severityCodes.warning;

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

    it('String schema has only an enum', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'filter',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['fiction', 'nonfiction'],
          },
        },
        {
          name: 'sort_order',
          in: 'query',
          schema: {
            type: ['string'],
            enum: ['asc', 'desc'],
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('String schema is in a not', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'filter',
          in: 'query',
          schema: {
            type: 'integer',
            not: {
              type: 'string',
            },
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Missing pattern when format is binary, byte, date, date-time, or url', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'hash',
          in: 'query',
          schema: {
            type: 'string',
            format: 'binary',
            minLength: 0,
            maxLength: 15,
          },
        },
        {
          name: 'trailer',
          in: 'query',
          schema: {
            type: ['string'],
            format: 'byte',
            minLength: 0,
            maxLength: 1024,
          },
        },
        {
          name: 'before_date',
          in: 'query',
          schema: {
            type: 'string',
            format: 'date',
          },
        },
        {
          name: 'after_date',
          in: 'query',
          schema: {
            type: 'string',
            format: 'date-time',
            minLength: 1,
            maxLength: 15,
          },
        },
        {
          name: 'imdb_url',
          in: 'query',
          schema: {
            type: 'string',
            format: 'url',
            maxLength: 1024,
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('String schema specifies pattern in oneOf schemas', async () => {
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
        description: 'Tests pattern field within oneOf',
        type: 'string',
        minLength: 1,
        maxLength: 38,
        oneOf: [
          {
            pattern: 'pattern1',
          },
          {
            pattern: 'pattern2',
          },
          {
            pattern: 'pattern3',
          },
        ],
        example: 'example string',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('String schema specifies fields in allOf schemas', async () => {
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
        description: 'Tests string fields within allOf',
        type: 'string',
        minLength: 1,
        maxLength: 38,
        allOf: [
          {
            minLength: 1,
          },
          {
            maxLength: 38,
          },
          {
            pattern: 'id:.*',
          },
        ],
        example: 'example string',
      };
      testDocument.components.schemas['RuleTester2'] = {
        description: 'Tests string fields within allOf',
        type: ['string'],
        minLength: 1,
        maxLength: 38,
        allOf: [
          {
            minLength: 1,
          },
          {
            maxLength: 38,
          },
          {
            pattern: 'id:.*',
          },
        ],
        example: 'example string',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('String schema is missing a `pattern` field', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'filter',
          in: 'query',
          schema: {
            type: 'string',
            minLength: 1,
            maxLength: 15,
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const validation = results[0];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        `String schemas should define property 'pattern'`
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/movies.post.parameters.0.schema'
      );
      expect(validation.severity).toBe(expectedSeverity);
    });

    it('String schema is missing a `minLength` field', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.parameters = [
        {
          name: 'metadata',
          in: 'header',
          content: {
            'text/plain': {
              schema: {
                type: ['string'],
                pattern: '[a-zA-Z0-9]+',
                maxLength: 15,
              },
            },
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const validation = results[0];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        `String schemas should define property 'minLength'`
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/movies.post.parameters.0.content.text/plain.schema'
      );
      expect(validation.severity).toBe(expectedSeverity);
    });

    it('String schema is missing a `maxLength` field', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.requestBody.content['text/plain'] =
        {
          schema: {
            type: 'string',
            pattern: '[a-zA-Z0-9]+',
            minLength: 15,
          },
        };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const validation = results[0];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        `String schemas should define property 'maxLength'`
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/movies.post.requestBody.content.text/plain.schema'
      );
      expect(validation.severity).toBe(expectedSeverity);
    });

    it('Non-string schema defines a `pattern` field', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.requestBody.content['text/plain'] =
        {
          schema: {
            type: 'integer',
            pattern: '.*',
          },
        };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const validation = results[0];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        `'pattern' should not be defined for non-string schemas`
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/movies.post.requestBody.content.text/plain.schema.pattern'
      );
      expect(validation.severity).toBe(expectedSeverity);
    });

    it('Non-string schema within patternProperties defines a `pattern` field', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.requestBody.content[
        'application/json'
      ] = {
        schema: {
          type: 'object',
          patternProperties: {
            '^foo.*$': {
              type: 'integer',
              pattern: '^fooValue.*$',
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const validation = results[0];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        `'pattern' should not be defined for non-string schemas`
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/movies.post.requestBody.content.application/json.schema.patternProperties.^foo.*$.pattern'
      );
      expect(validation.severity).toBe(expectedSeverity);
    });

    it('Non-string schema defines a `minLength` field', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.responses['201'].content[
        'text/plain'
      ] = {
        schema: {
          type: ['integer', 'null', 'boolean'],
          minLength: 15,
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const validation = results[0];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        `'minLength' should not be defined for non-string schemas`
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/movies.post.responses.201.content.text/plain.schema.minLength'
      );
      expect(validation.severity).toBe(expectedSeverity);
    });

    it('Non-string schema defines a `maxLength` field', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.requestBody.content['text/plain'] =
        {
          schema: {
            type: 'integer',
            maxLength: 15,
          },
        };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const validation = results[0];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        `'maxLength' should not be defined for non-string schemas`
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/movies.post.requestBody.content.text/plain.schema.maxLength'
      );
      expect(validation.severity).toBe(expectedSeverity);
    });

    it('String schema has a `minLength` value greater than the `maxLength` value', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.requestBody.content['text/plain'] =
        {
          schema: {
            type: 'string',
            pattern: '[a-zA-Z0-9]+',
            maxLength: 10,
            minLength: 15,
          },
        };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const validation = results[0];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        `'minLength' cannot be greater than 'maxLength'`
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/movies.post.requestBody.content.text/plain.schema'
      );
      expect(validation.severity).toBe(expectedSeverity);
    });

    it('Invalid string schema is part of a composed schema', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.requestBody.content['text/plain'] =
        {
          schema: {
            allOf: [
              {
                type: 'string',
                maxLength: 10,
                minLength: 1,
              },
              {
                anyOf: [
                  {
                    type: ['string'],
                    maxLength: 10,
                    minLength: 1,
                  },
                  {
                    oneOf: [
                      {
                        type: ['string'],
                        maxLength: 10,
                        minLength: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        `String schemas should define property 'pattern'`
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.requestBody.content.text/plain.schema'
      );
    });

    it('Invalid string schema is defined at path level', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].parameters = [
        {
          name: 'filter',
          in: 'query',
          schema: {
            type: ['string'],
            minLength: 1,
            maxLength: 15,
          },
        },
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const validation = results[0];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        `String schemas should define property 'pattern'`
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/movies.parameters.0.schema'
      );
      expect(validation.severity).toBe(expectedSeverity);
    });

    it('String schema specifies maxLength in only SOME oneOf schemas', async () => {
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
        description: 'Tests maxLength field within oneOf',
        type: 'string',
        minLength: 1,
        pattern: '.*',
        oneOf: [
          {
            maxLength: 38,
          },
          {
            maxLength: 74,
          },
          {
            description: 'No maxLength field in this schema',
          },
        ],
        example: 'example string',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const validation = results[0];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        `String schemas should define property 'maxLength'`
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/movies.post.parameters.0.schema'
      );
      expect(validation.severity).toBe(expectedSeverity);
    });

    it('String schema specifies pattern in only SOME anyOf schemas', async () => {
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
        description: 'Tests pattern field within anyOf',
        type: ['string'],
        minLength: 1,
        maxLength: 38,
        oneOf: [
          {
            pattern: '.*',
          },
          {
            pattern: 'id-[0-9]+.*',
          },
          {
            description: 'No pattern field in this schema',
          },
        ],
        example: 'example string',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      const validation = results[0];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        `String schemas should define property 'pattern'`
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/movies.post.parameters.0.schema'
      );
      expect(validation.severity).toBe(expectedSeverity);
    });

    it('Response body string schema has no keywords', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies/{movie_id}'].get.responses['200'] = {
        content: {
          'application/json': {
            schema: {
              properties: {
                name: {
                  type: 'string',
                  description: 'no validation',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);

      const expectedPath =
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.name';
      const expectedMessages = [
        `String schemas should define property 'pattern'`,
        `String schemas should define property 'minLength'`,
        `String schemas should define property 'maxLength'`,
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessages[i]);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPath);
      }
    });
    it('Response header string schema has no keywords', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.responses['MovieWithETag'].headers[
        'X-IBM-Something'
      ] = {
        description: 'A non-compliant response header.',
        schema: {
          type: 'string',
          description: 'no validation',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(6);

      const expectedPaths = [
        'paths./v1/movies/{movie_id}.get.responses.200.headers.X-IBM-Something.schema',
        'paths./v1/movies/{movie_id}.get.responses.200.headers.X-IBM-Something.schema',
        'paths./v1/movies/{movie_id}.get.responses.200.headers.X-IBM-Something.schema',
        'paths./v1/movies/{movie_id}.put.responses.200.headers.X-IBM-Something.schema',
        'paths./v1/movies/{movie_id}.put.responses.200.headers.X-IBM-Something.schema',
        'paths./v1/movies/{movie_id}.put.responses.200.headers.X-IBM-Something.schema',
      ];
      const expectedMessages = [
        `String schemas should define property 'pattern'`,
        `String schemas should define property 'minLength'`,
        `String schemas should define property 'maxLength'`,
        `String schemas should define property 'pattern'`,
        `String schemas should define property 'minLength'`,
        `String schemas should define property 'maxLength'`,
      ];

      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMessages[i]);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
