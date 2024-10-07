/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { inlineSchemas } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = inlineSchemas;
const ruleId = 'ibm-avoid-inline-schemas';
const expectedSeverity = severityCodes.warning;
const expectedMsgProperty =
  'Nested objects should be defined as a $ref to a named schema';
const expectedMsgRequest =
  'Request body schemas should be defined as a $ref to a named schema';
const expectedMsgResponse =
  'Response schemas should be defined as a $ref to a named schema';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline object schema w/no properties', async () => {
      const testDocument = makeCopy(rootDocument);

      // empty object
      testDocument.components.schemas.Car.properties['inline_prop1'] = {
        type: 'object',
      };

      // any object
      testDocument.components.schemas.Car.properties['inline_prop2'] = {
        type: 'object',
        additionalProperties: true,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline object schema w/annotation but no properties', async () => {
      const testDocument = makeCopy(rootDocument);

      // empty object
      testDocument.components.schemas.Car.properties['inline_prop1'] = {
        'type': 'object',
        'x-foo': 'bar',
      };

      // any object
      testDocument.components.schemas.Car.properties['inline_prop2'] = {
        'type': 'object',
        'additionalProperties': true,
        'x-terraform-sensitive': 'bar',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Ref sibling', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        allOf: [
          {
            $ref: '#/components/schemas/CarPatch',
          },
          {
            description: 'An instance of a patched car.',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Composed primitive schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        oneOf: [
          {
            type: 'string',
          },
          {
            type: 'string',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Inline primitive schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'string',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline object schema w/ non-JSON mimetype', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content = {
        'text/html': {
          schema: {
            description:
              'Inline object schema for a non-JSON requestBody; should be ignored',
            type: 'object',
            properties: {
              test_prop: {
                type: 'string',
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline object schema w/ non-JSON mimetype (referenced requestBody)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.requestBodies.CarRequest.content = {
        'text/html': {
          schema: {
            description:
              'Inline object schema for a non-JSON requestBody; should be ignored',
            type: 'object',
            properties: {
              test_prop: {
                type: 'string',
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline array schema w/primitive items', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'array',
        items: {
          type: 'integer',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Ref sibling pattern', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        allOf: [
          {
            $ref: '#/components/schemas/Drink',
          },
          {
            description:
              'This is an alternate description for the Drink schema.',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Composed primitive schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        oneOf: [
          {
            type: 'string',
          },
          {
            type: 'string',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline primitive schema in success response', async () => {
      const testDocument = makeCopy(rootDocument);

      // Replace a ref with an inline primitive schema.
      testDocument.paths['/v1/movies'].post.responses['201'].content[
        'application/json'
      ].schema = {
        type: 'string',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline schema in non-JSON success response', async () => {
      const testDocument = makeCopy(rootDocument);

      // Replace response with non-json content.
      testDocument.paths['/v1/movies'].post.responses['201'].content = {
        'text/html': {
          schema: {
            description:
              'Inline object schema for a non-JSON response; should be ignored',
            type: 'object',
            properties: {
              test_prop: {
                type: 'string',
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('No schema in success response', async () => {
      const testDocument = makeCopy(rootDocument);

      // Remove the schema from a success response.
      delete testDocument.paths['/v1/movies'].post.responses['201'].content[
        'application/json'
      ].schema;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline array schema w/primitive items in success response', async () => {
      const testDocument = makeCopy(rootDocument);

      // Replace a ref with an inline array schema.
      testDocument.paths['/v1/movies'].post.responses['201'].content[
        'application/json'
      ].schema = {
        type: 'array',
        items: {
          type: 'integer',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
    it('Inline array schema w/$ref items in error response', async () => {
      const testDocument = makeCopy(rootDocument);

      // Replace a ref with an inline array schema.
      testDocument.paths['/v1/movies'].post.responses['400'].content[
        'application/json'
      ].schema = {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Error',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('2-element Ref sibling in success response', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['201'].content[
        'application/json'
      ].schema = {
        allOf: [
          {
            $ref: '#/components/schemas/Movie',
          },
          {
            description: 'The create_movie operation returns a Movie instance.',
            nullable: false,
            example: 'foo',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('1-element Ref sibling in success response', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['201'].content[
        'application/json'
      ].schema = {
        allOf: [
          {
            $ref: '#/components/schemas/Movie',
          },
        ],
        description: 'The create_movie operation returns a Movie instance.',
        nullable: false,
        example: 'foo',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Composed primitive schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['201'].content[
        'application/json'
      ].schema = {
        oneOf: [
          {
            type: 'string',
          },
          {
            type: 'string',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline primitive in additionalProperties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.additionalProperties = {
        description: 'Inline string schema within additionalProperties',
        type: 'string',
        pattern: '^blah.*$',
        minLength: 0,
        maxLength: 64,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Inline primitive in patternProperties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.openapi = '3.1.0';
      testDocument.components.schemas.Car.patternProperties = {
        '^foo.*$': {
          description: 'Inline object schema within additionalProperties',
          type: 'string',
          pattern: '^blah.*$',
          minLength: 0,
          maxLength: 64,
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Schema property defined with inline object schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        type: 'object',
        properties: {
          nested_prop: {
            type: 'string',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProperty);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop'
      );
    });

    it('Inline object in allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        allOf: [
          {
            properties: {
              nested_prop: {
                type: 'string',
              },
            },
          },
          {
            description: 'A nested property.',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProperty);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop'
      );
    });

    it('Inline object in anyOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        anyOf: [
          {
            description: 'A nested property.',
            properties: {
              nested_prop: {
                type: 'string',
              },
            },
          },
          {
            description: 'An alternative string representation.',
            type: 'string',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsgProperty);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop'
      );
      expect(results[1].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop.anyOf.0'
      );
    });

    it('Inline object in oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        oneOf: [
          {
            description: 'An alternative string representation.',
            type: 'string',
          },
          {
            description: 'A nested property.',
            properties: {
              nested_prop: {
                type: 'string',
              },
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsgProperty);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop'
      );
      expect(results[1].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop.oneOf.1'
      );
    });

    it('Inline object in array items', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_array_prop'] = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            element: {
              type: 'string',
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProperty);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_array_prop.items'
      );
    });

    it('Inline object in additionalProperties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.additionalProperties = {
        description: 'Inline object schema within additionalProperties',
        properties: {
          prop1: {
            type: 'string',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProperty);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.additionalProperties'
      );
    });

    it('Inline object in patternProperties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.openapi = '3.1.0';
      testDocument.components.schemas.Car.patternProperties = {
        '^foo.*$': {
          description: 'Inline object schema within additionalProperties',
          properties: {
            prop1: {
              type: 'string',
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProperty);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.patternProperties.^foo.*$'
      );
    });

    it('Inline composed schema in additionalProperties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['inline_prop'] = {
        allOf: [
          {
            $ref: '#/components/schemas/Drink',
          },
          {
            $ref: '#/components/schemas/Car',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProperty);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.properties.inline_prop'
      );
    });

    it('Inline composed schema via oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.additionalProperties = {
        oneOf: [
          {
            $ref: '#/components/schemas/Drink',
          },
          {
            description:
              'This is an alternate description for the Drink schema.',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsgProperty);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.additionalProperties'
      );
      expect(results[1].path.join('.')).toBe(
        'components.schemas.Car.additionalProperties.oneOf.1'
      );
    });

    it('Inline composed schema with altered required properties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.additionalProperties = {
        allOf: [
          {
            $ref: '#/components/schemas/Drink',
          },
          {
            required: ['type'],
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProperty);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.additionalProperties'
      );
    });
    it('Inline object schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = testDocument.components.schemas.Drink;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgRequest);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Inline composed schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        allOf: [
          {
            type: 'object',
            properties: {
              prop1: {
                type: 'string',
              },
            },
          },
          {
            properties: {
              prop2: {
                type: 'string',
              },
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgRequest);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Inline composed schema in referenced requestBody', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.requestBodies.CarRequest.content[
        'application/json'
      ].schema = {
        allOf: [
          {
            type: 'object',
            properties: {
              prop1: {
                type: 'string',
              },
            },
          },
          {
            properties: {
              prop2: {
                type: 'string',
              },
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgRequest);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.requestBodies.CarRequest.content.application/json.schema'
      );
    });

    it('NOT ref sibling pattern', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        allOf: [
          {
            $ref: '#/components/schemas/Drink',
          },
          {
            type: 'object',
            description:
              'This is an alternate description for the Drink schema.',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgRequest);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Inline composed schema via multiple references', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        allOf: [
          {
            $ref: '#/components/schemas/Drink',
          },
          {
            $ref: '#/components/schemas/Car',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgRequest);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Inline composed schema with altered required properties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        allOf: [
          {
            $ref: '#/components/schemas/Drink',
          },
          {
            required: ['type'],
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgRequest);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema'
      );
    });

    it('Inline array schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'array',
        items: testDocument.components.schemas.Drink,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProperty);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema.items'
      );
    });
    it('Inline schema in error response', async () => {
      const testDocument = makeCopy(rootDocument);

      // Change a response to use an inline schema.
      testDocument.paths['/v1/movies'].post.responses['400'].content[
        'application/json'
      ].schema = {
        description: 'An error response.',
        type: 'object',
        properties: {
          errors: {
            type: 'array',
            minItems: 0,
            maxItems: 100,
            description:
              'The array of error entries associated with the error response',
            items: {
              $ref: '#/components/schemas/Error',
            },
          },
          trace: {
            description: 'The error trace information.',
            type: 'string',
            format: 'uuid',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgResponse);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.400.content.application/json.schema'
      );
    });

    it('Inline schema in success response', async () => {
      const testDocument = makeCopy(rootDocument);

      // Replace a ref with the referenced schema within a success response.
      testDocument.paths['/v1/movies'].post.responses['201'].content[
        'application/json'
      ].schema = testDocument.components.schemas.Movie;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgResponse);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.201.content.application/json.schema'
      );
    });

    it('Inline composed schema in success response', async () => {
      const testDocument = makeCopy(rootDocument);

      // Replace a ref with the referenced schema within a success response.
      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = testDocument.components.schemas.Drink;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgResponse);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema'
      );
    });

    it('Inline schema in referenced success response', async () => {
      const testDocument = makeCopy(rootDocument);

      // Replace a ref with the referenced schema within a named success response.
      testDocument.components.responses.ConsumedDrink.content[
        'application/json'
      ].schema = testDocument.components.schemas.Soda;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgResponse);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.responses.ConsumedDrink.content.application/json.schema'
      );
    });

    it('Inline schema in referenced error response', async () => {
      const testDocument = makeCopy(rootDocument);

      // Replace a ref with the referenced schema within a named success response.
      testDocument.components.responses.BarIsClosed.content[
        'application/json'
      ].schema = testDocument.components.schemas.Error;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgResponse);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.responses.BarIsClosed.content.application/json.schema'
      );
    });

    it('Non ref-sibling composed schema in success response', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['201'].content[
        'application/json'
      ].schema = {
        allOf: [
          {
            $ref: '#/components/schemas/Movie',
          },
          {
            description: 'Not a ref-sibling!',
            minProperties: 1,
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgResponse);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.201.content.application/json.schema'
      );
    });

    it('Non ref-sibling composed schema in success response', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['201'].content[
        'application/json'
      ].schema = {
        allOf: [
          {
            $ref: '#/components/schemas/Movie',
          },
        ],
        description: 'Still not a ref-sibling!',
        pattern: '.*',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgResponse);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.201.content.application/json.schema'
      );
    });
  });
});
