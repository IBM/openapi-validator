/**
 * Copyright 2023 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { resourceResponseConsistency } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = resourceResponseConsistency;
const ruleId = 'ibm-resource-response-consistency';
const expectedSeverity = severityCodes.warning;
const expectedMsgSingle =
  'Operations on a single resource instance should return the resource canonical schema';
const expectedMsgBulk =
  'Bulk resource operations should return the resource collection schema';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('202 create response does not need to match canonical schema', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/drinks'].post.responses['201'];
      testDocument.paths['/v1/drinks'].post.responses['202'] = {
        description: 'Asynchronous success!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              description: 'object containing status of creation operation',
              properties: {
                status: {
                  type: 'string',
                  description: 'current state of resource',
                  enum: ['pending', 'failed', 'created'],
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('create operation defines no responses', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/drinks'].post.responses;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('create operation defines no success codes', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/drinks'].post.responses['201'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('create operation defines no success response content', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/drinks'].post.responses['201'].content;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('create operation defines no JSON response content', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('create operation defines no schema for JSON response content', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('PUT request on generic, non-collection path returns canonical schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{id}/recipe'] = {
        put: {
          operationId: 'replace_drink_recipe',
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Recipe',
                  },
                },
              },
            },
          },
        },
        get: {
          operationId: 'get_drink_recipe',
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Recipe',
                  },
                },
              },
            },
          },
        },
      };

      testDocument.components.schemas.Recipe = {
        type: 'object',
        description: 'A recipe resource to bind to a drink resource',
        properties: {
          ingredients: {
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

    it('PUT request on collection path returns collection schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'] = {
        put: {
          operationId: 'replace_drinks',
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/DrinkCollection',
                  },
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
    it('200 create request that does not return canonical schema', async () => {
      const testDocument = makeCopy(rootDocument);

      // convert 201 response into 200
      testDocument.paths['/v1/drinks'].post.responses['200'] =
        testDocument.paths['/v1/drinks'].post.responses['201'];
      delete testDocument.paths['/v1/drinks'].post.responses['201'];

      // redo the response schema
      testDocument.paths['/v1/drinks'].post.responses['200'].content[
        'application/json'
      ].schema.$ref = '#/components/schemas/Car';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgSingle}: Drink`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.200.content.application/json'
      );
    });

    it('201 create request that does not return canonical schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema.$ref = '#/components/schemas/Car';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgSingle}: Drink`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json'
      );
    });

    it('warns for all JSON content schemas on create that do not match canonical schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema.$ref = '#/components/schemas/Car';

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json; charset=utf-8'
      ] = {
        schema: {
          $ref: '#/components/schemas/Car',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgSingle}: Drink`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json'
      );

      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(`${expectedMsgSingle}: Drink`);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json; charset=utf-8'
      );
    });

    it('warns for both 200 and 201 responses on create that do not match the canonical schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['200'] = {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Car',
            },
          },
        },
      };

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema.$ref = '#/components/schemas/Car';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgSingle}: Drink`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.200.content.application/json'
      );

      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(`${expectedMsgSingle}: Drink`);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json'
      );
    });

    it('200 PUT request that does not return canonical schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies/{movie_id}'].put.responses['200'] = {
        content: {
          'application/json; charset=utf-8': {
            schema: {
              $ref: '#/components/schemas/Car',
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgSingle}: Movie`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json; charset=utf-8'
      );
    });

    it('200 PATCH request that does not return canonical schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/cars/{car_id}'].patch.responses['200'].content[
        'application/json'
      ].schema.$ref = '#/components/schemas/Movie';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgSingle}: Car`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/cars/{car_id}.patch.responses.200.content.application/json'
      );
    });

    it('Specific JSON content on GET request is found for comparison', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/cars/{car_id}'].patch.responses['200'].content[
        'application/json'
      ].schema.$ref = '#/components/schemas/Movie';

      testDocument.paths['/v1/cars/{car_id}'].get.responses['200'].content = {
        'application/json; charset=utf-8': {
          schema: '#/components/schemas/Car',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgSingle}: Car`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/cars/{car_id}.patch.responses.200.content.application/json'
      );
    });

    it('PUT request on generic, non-collection path does not return canonical schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks/{id}/recipe'] = {
        put: {
          operationId: 'replace_drink_recipe',
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Drink',
                  },
                },
              },
            },
          },
        },
        get: {
          operationId: 'get_drink_recipe',
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Recipe',
                  },
                },
              },
            },
          },
        },
      };

      testDocument.components.schemas.Recipe = {
        type: 'object',
        description: 'A recipe resource to bind to a drink resource',
        properties: {
          ingredients: {
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
      expect(results[0].message).toBe(`${expectedMsgSingle}: Recipe`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks/{id}/recipe.put.responses.200.content.application/json'
      );
    });

    it('PUT request on collection path does not return collection schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].put = {
        operationId: 'replace_drinks',
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Drink',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgBulk}: DrinkCollection`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.put.responses.200.content.application/json'
      );
    });
  });
});
