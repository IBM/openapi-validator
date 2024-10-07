/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { requestBodyName } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-requestbody-name';
const rule = requestBodyName;
const expectedSeverity = severityCodes.warning;
const expectedMsg = `Operations with non-form request bodies should set a name with the 'x-codegen-request-body-name' extension`;

// This rule is turned off by default - enable it to run tests
// but still verify it is defined in the rule as "off".
const originalSeverity = makeCopy(rule.severity);
rule.severity = 'warn';

// `Operation with non-form requestBody should set a name with the ${EXTENSION_NAME} extension.`
describe(`Spectral rule: ${ruleId}`, () => {
  it('Should originally be set to severity: "off"', () => {
    expect(originalSeverity).toBe('off');
  });

  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Request body has multi-content, extension present', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add the extension and an additional requestBody content entry to the "create_movie" operation.
      testDocument.paths['/v1/movies'].post['x-codegen-request-body-name'] =
        'movie';
      testDocument.paths['/v1/movies'].post.requestBody.content[
        'application/octet-stream'
      ] = {
        schema: {
          $ref: '#/components/schemas/Movie',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Request body schema is dynamic, extension present', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post['x-codegen-request-body-name'] =
        'movie';
      testDocument.components.schemas.Movie.additionalProperties = true;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Request body schema has discriminator, extension present', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post['x-codegen-request-body-name'] =
        'movie';
      testDocument.components.schemas.Movie.discriminator = {
        propertyName: 'type',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Request body has non-json content, extension present', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post['x-codegen-request-body-name'] =
        'movie';
      testDocument.paths['/v1/movies'].post.requestBody.content = {
        'application/octet-stream': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Request body is an array, extension present', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post['x-codegen-request-body-name'] =
        'movie';
      testDocument.paths['/v1/movies'].post.requestBody.content = {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Request body has form content, no extension needed', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.requestBody.content = {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              form_param_1: {
                $ref: '#/components/schemas/NormalString',
              },
              form_param_2: {
                $ref: '#/components/schemas/NormalString',
              },
              form_param_3: {
                type: 'string',
                format: 'binary',
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
    it('Request body has multi-content, extension missing', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add a second mimeType to the requestBody content field.
      testDocument.paths['/v1/movies'].post.requestBody.content[
        'application/octet-stream'
      ] = {
        schema: {
          $ref: '#/components/schemas/Movie',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/movies.post');
    });

    it('Request body schema is abstract, extension missing', async () => {
      const testDocument = makeCopy(rootDocument);

      // The Drink schema is already abstract, so just remove the extension
      // to simulate the error.
      delete testDocument.paths['/v1/drinks'].post[
        'x-codegen-request-body-name'
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post');
    });

    it('Request body schema is dynamic, extension missing', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.MoviePrototype.additionalProperties = true;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/movies.post');
    });

    it('Request body schema has discriminator, extension missing', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.MoviePrototype.discriminator = {
        propertyName: 'type',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/movies.post');
    });

    it('Request body has non-json content, extension missing', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.requestBody.content = {
        'application/octet-stream': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/movies.post');
    });

    it('Request body is an array, extension missing', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.requestBody.content = {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/movies.post');
    });
  });
});
