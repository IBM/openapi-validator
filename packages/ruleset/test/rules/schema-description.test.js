/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { schemaDescriptionExists } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = schemaDescriptionExists;
const ruleId = 'ibm-schema-description';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'Schemas should have a non-empty description';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('OneOf child schema with no description', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Soda'].description = undefined;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Schema with description in oneOf schemas', async () => {
      const testDocument = makeCopy(rootDocument);

      // This should pass because the oneOf list elements each have a description.
      testDocument.components.schemas['Drink'] = {
        oneOf: [
          {
            $ref: '#/components/schemas/Juice',
          },
          {
            $ref: '#/components/schemas/Soda',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Schema with description in anyOf schemas', async () => {
      const testDocument = makeCopy(rootDocument);

      // This should pass because the anyOf list elements each have a description.
      testDocument.components.schemas['Drink'] = {
        anyOf: [
          {
            $ref: '#/components/schemas/Juice',
          },
          {
            $ref: '#/components/schemas/Soda',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Array items schema with no description', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['MovieNameList'] = {
        description: 'A list response.',
        type: 'object',
        properties: {
          movieNames: {
            description: 'List of movie names.',
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      };

      testDocument.paths['/v1/movies'].get.responses['200'].content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/MovieNameList',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Request body schema with no description', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content = {
        'text/html': {
          schema: {
            type: 'string',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.text/html.schema'
      );
    });

    it('Response schema with only spaces in the description', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['400'].content[
        'application/json'
      ].schema = {
        description: '      ',
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
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.400.content.application/json.schema'
      );
    });

    it('Re-used oneOf child schema with no description', async () => {
      const testDocument = makeCopy(rootDocument);

      // Remove description from Soda schema.
      testDocument.components.schemas['Soda'].description = undefined;

      // Add another (non-oneOf) reference to the Soda schema.
      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/Soda',
      };

      // We should get back a warning ONLY due to the Soda reference in the response (not the oneOf).
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema'
      );
    });
  });
});
