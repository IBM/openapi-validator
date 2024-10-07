/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { schemaTypeExists } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = schemaTypeExists;
// this rule is turned off by default - enable it to run tests
// but still verify it is defined in the rule as "off"
const originalSeverity = makeCopy(rule.severity);
rule.severity = 'warn';

const ruleId = 'ibm-schema-type';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'Schemas should have a non-empty type field';

describe(`Spectral rule: ${ruleId}`, () => {
  it('Should originally be set to severity: "off"', () => {
    expect(originalSeverity).toBe('off');
  });

  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Response schema, property defined correctly with nested allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['400'] = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                no_type: {
                  allOf: [
                    {
                      allOf: [
                        {
                          description: 'nested allOf definition',
                        },
                        {
                          type: 'string',
                        },
                      ],
                    },
                    {
                      description: 'overridden description, but no type',
                    },
                  ],
                },
              },
            },
          },
        },
      };

      testDocument.paths['/v1/movies'].post.responses['401'] = {
        content: {
          'application/json': {
            schema: {
              type: ['object'],
              properties: {
                no_type: {
                  allOf: [
                    {
                      allOf: [
                        {
                          description: 'nested allOf definition',
                        },
                        {
                          type: ['string'],
                        },
                      ],
                    },
                    {
                      description: 'overridden description, but no type',
                    },
                  ],
                },
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
    it('Request body schema with no type', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content = {
        'text/html': {
          schema: {
            description: 'a string schema, obviously',
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

    it('Response schema with only spaces in the type', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['400'].content[
        'application/json'
      ].schema = {
        type: '  ',
        description: 'an object schema',
        properties: {
          errors: {
            type: 'array',
            minItems: 0,
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

    it('Request body sub-schema with no type', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content = {
        'application/json': {
          schema: {
            type: 'object',
            description: 'under-specified request body object',
            properties: {
              important_property: {
                description: 'what type am i?',
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.requestBody.content.application/json.schema.properties.important_property'
      );
    });
    it('Response schema, property defined with allOf no type', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['400'].content[
        'application/json'
      ].schema = {
        type: 'object',
        properties: {
          no_type: {
            allOf: [
              {
                description: 'no type in allOf element',
                properties: {
                  has_a_type: {
                    type: 'string',
                  },
                },
              },
              {
                description: 'overridden description, but no type',
              },
            ],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.400.content.application/json.schema.properties.no_type'
      );
    });
    it('Response schema, property defined with nested allOf no type', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['400'].content[
        'application/json'
      ].schema = {
        type: 'object',
        properties: {
          no_type: {
            allOf: [
              {
                allOf: [
                  {
                    description: 'nested allOf definition',
                  },
                ],
              },
              {
                description: 'overridden description, but no type',
              },
            ],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.400.content.application/json.schema.properties.no_type'
      );
    });
  });
});
