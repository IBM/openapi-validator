/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { validSchemaExample } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = validSchemaExample;
const ruleId = 'ibm-valid-schema-example';
const expectedSeverity = severityCodes.warning;
const expectedMsgPrefix = 'Schema example is not valid:';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    const expectedExamplePaths = [
      'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.prop.example',
      'paths./v1/movies.post.responses.201.content.application/json.schema.properties.prop.example',
      'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.prop.example',
      'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.prop.example',
    ];

    const expectedExamplesPaths = [
      'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.prop.examples.0',
      'paths./v1/movies.post.responses.201.content.application/json.schema.properties.prop.examples.0',
      'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.prop.examples.0',
      'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.prop.examples.0',
    ];

    it('Schema has undefined example in examples array', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.prop = {
        type: 'string',
        examples: [undefined],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} is not of a type(s) string`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedExamplesPaths[i]);
      }
    });

    it('String schema has non-string example', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.prop = {
        type: 'string',
        example: 42,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} is not of a type(s) string`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedExamplePaths[i]);
      }
    });

    it('String schema has pattern-violating example in examples array', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.prop = {
        type: 'string',
        pattern: '^ibm-.+$',
        examples: ['bad example', 'ibm-good-example'],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} does not match pattern "^ibm-.+$"`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedExamplesPaths[i]);
      }
    });

    it('String schema has minLength-violating example', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.prop = {
        type: 'string',
        minLength: 4,
        example: 'abc',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} does not meet minimum length of 4`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedExamplePaths[i]);
      }
    });

    it('Number schema has non-number example', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.prop = {
        type: 'integer',
        example: '123',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} is not of a type(s) integer`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedExamplePaths[i]);
      }
    });

    it('Number schema has maximum-violating number example', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.prop = {
        type: 'integer',
        maximum: 100,
        example: 9000,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} must be less than or equal to 100`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedExamplePaths[i]);
      }
    });

    it('Array schema has example violating nested object schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.prop = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            metadata: {
              type: 'string',
            },
          },
        },
        example: [{ metadata: 42 }],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} 0.metadata is not of a type(s) string`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedExamplePaths[i]);
      }
    });

    it('Object schema has example without required property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.prop = {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
        },
        example: { name: 'gollum' },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} requires property "id"`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedExamplePaths[i]);
      }
    });

    it('Object schema has example violating deeply nested object schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.prop = {
        type: 'object',
        properties: {
          other_prop: {
            type: 'object',
            properties: {
              and_another_prop: {
                type: 'boolean',
              },
            },
          },
        },
        example: { other_prop: { and_another_prop: 42 } },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} other_prop.and_another_prop is not of a type(s) boolean`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedExamplePaths[i]);
      }
    });

    it('Object schema has example that does not match oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.prop = {
        type: 'object',
        oneOf: [
          {
            title: 'A',
            type: 'object',
            properties: {
              other_prop: {
                type: 'string',
              },
            },
            additionalProperties: false,
          },
          {
            title: 'B',
            type: 'object',
            properties: {
              another_prop: {
                type: 'string',
              },
            },
            additionalProperties: false,
          },
        ],
        properties: {
          main_prop: {
            type: 'string',
          },
        },
        example: { main_prop: 'value', other_prop: 'other value' },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} is not exactly one from "A","B" (is not allowed to have the additional property "main_prop")`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedExamplePaths[i]);
      }
    });

    it('Object schema has example that does not match anyOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.prop = {
        type: 'object',
        anyOf: [
          {
            title: 'A',
            type: 'object',
            properties: {
              other_prop: {
                type: 'string',
              },
            },
            additionalProperties: false,
          },
          {
            title: 'B',
            type: 'object',
            properties: {
              another_prop: {
                type: 'string',
              },
            },
            additionalProperties: false,
          },
        ],
        example: { other_prop: 42 },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} is not any of "A","B" (other_prop is not of a type(s) string)`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedExamplePaths[i]);
      }
    });

    it('Object allOf schema has primitive example', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.prop = {
        type: 'object',
        allOf: [
          {
            title: 'A',
            type: 'object',
            properties: {
              other_prop: {
                type: 'string',
              },
            },
          },
          {
            title: 'B',
            type: 'object',
            properties: {
              another_prop: {
                type: 'string',
              },
            },
          },
        ],
        example: 'my-props.json',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} is not of a type(s) object`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedExamplePaths[i]);
      }
    });

    it('Object allOf schema has violating example', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.prop = {
        type: 'object',
        allOf: [
          {
            title: 'A',
            type: 'object',
            properties: {
              other_prop: {
                type: 'string',
              },
            },
          },
          {
            title: 'B',
            type: 'object',
            properties: {
              another_prop: {
                type: 'string',
              },
            },
          },
        ],
        example: { other_prop: 42 },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);

      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `${expectedMsgPrefix} does not match allOf schema "A" (other_prop is not of a type(s) string)`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedExamplePaths[i]);
      }
    });
  });
});
