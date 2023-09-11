/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { arrayAttributes } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = arrayAttributes;
const ruleId = 'ibm-array-attributes';
const expectedSeverity = severityCodes.warning;
const expectedMsgMin = `Array schemas should define a numeric 'minItems' field`;
const expectedMsgMax = `Array schemas should define a numeric 'maxItems' field`;
const expectedMsgItems = `Array schemas must specify the 'items' field`;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Array property with min/maxItems in allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        description: 'Drink response schema',
        properties: {
          main_prop: {
            allOf: [
              {
                type: 'array',
                description: 'a description',
                items: {
                  type: 'string',
                },
              },
              {
                type: 'array',
                minItems: 12,
                maxItems: 42,
              },
            ],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Schema property uses nested allOf/oneOf with mix/maxItems', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        description: 'Drink response schema',
        properties: {
          main_prop: {
            // At least one of the allOf schemas should have min/maxItems.
            allOf: [
              {
                // Each of the oneOf schemas should have min/maxItems
                oneOf: [
                  {
                    type: 'array',
                    minItems: 45,
                    maxItems: 100000,
                  },
                  {
                    type: 'array',
                    minItems: 100001,
                    maxItems: 100500,
                  },
                ],
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('minItems and maxItems defined', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['wheel_count'] = {
        type: 'array',
        minItems: 3,
        maxItems: 4,
        items: {
          type: 'integer',
        },
      };

      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('minItems <= maxItems', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['wheel_count'] = {
        type: 'array',
        minItems: 3,
        maxItems: 3,
        items: {
          type: 'integer',
        },
      };

      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Array property with no min/maxItems', async () => {
      const testDocument = makeCopy(rootDocument);

      // Make a copy of Movie named Movie2, and make Movie2 the response schema
      // for the create operation only.
      const movie2 = makeCopy(testDocument.components.schemas['Movie']);
      movie2.properties['production_crew'] = {
        type: 'array',
        items: {
          type: 'string',
        },
      };
      testDocument.components.schemas['Movie2'] = movie2;
      testDocument.paths['/v1/movies'].post.responses['201'].content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/Movie2',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMin);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.production_crew'
      );

      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(expectedMsgMax);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path.join('.')).toBe(
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.production_crew'
      );
    });

    it('Inline response schema array property with only minItems', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['400'].content[
        'application/json'
      ].schema = {
        description: 'An error response.',
        type: 'object',
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
      expect(results[0].message).toBe(expectedMsgMax);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.400.content.application/json.schema.properties.errors'
      );
    });

    it('Schema property uses allOf without min/maxItems', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        description: 'a description',
        properties: {
          main_prop: {
            allOf: [
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              {
                type: 'array',
              },
            ],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMin);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.main_prop'
      );

      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(expectedMsgMax);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.main_prop'
      );
    });

    it('Schema property uses oneOf without min/maxItems', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        description: 'a description',
        properties: {
          main_prop: {
            oneOf: [
              {
                type: 'array',
                items: {
                  type: 'string',
                },
                minItems: 0,
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
                maxItems: 5,
              },
            ],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMin);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.main_prop'
      );

      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(expectedMsgMax);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.main_prop'
      );
    });

    it('Schema property uses anyOf without min/maxItems', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        description: 'a description',
        properties: {
          main_prop: {
            anyOf: [
              {
                type: 'array',
                items: {
                  type: 'string',
                },
                minItems: 0,
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
                maxItems: 5,
              },
            ],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(2);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMin);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.main_prop'
      );

      expect(results[1].code).toBe(ruleId);
      expect(results[1].message).toBe(expectedMsgMax);
      expect(results[1].severity).toBe(expectedSeverity);
      expect(results[1].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.main_prop'
      );
    });

    it('Schema property uses nested allOf/oneOf without maxItems', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        description: 'a description',
        properties: {
          main_prop: {
            oneOf: [
              {
                allOf: [
                  {
                    type: 'array',
                    minItems: 0,
                    maxItems: 4,
                  },
                  {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                ],
              },
              {
                type: 'array',
                minItems: 0,
                items: {
                  type: 'string',
                },
              },
            ],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMax);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.main_prop'
      );
    });

    it('Schema property uses nested allOf/anyOf without minItems', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        description: 'a description',
        properties: {
          main_prop: {
            anyOf: [
              {
                allOf: [
                  {
                    type: 'array',
                    minItems: 0,
                    maxItems: 4,
                  },
                  {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                ],
              },
              {
                type: 'array',
                maxItems: 1600,
                items: {
                  type: 'string',
                },
              },
            ],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMin);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.main_prop'
      );
    });
    it('allOf element without items property', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.schemas.DrinkCollection.allOf[1].properties
        .drinks.items;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgItems);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks'
      );
    });
    it('Response schema without items property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.MovieCollection = {
        type: 'array',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgItems);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.get.responses.200.content.application/json.schema'
      );
    });
    it('Request schema without items property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'array',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgItems);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.requestBody.content.application/json.schema'
      );
    });

    it('Request schema with non-object items property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'array',
        items: 'not a schema!',
      };

      // If the API definition contains an array schema with the items
      // field set to something other than an object (e.g. a string),
      // then spectral will throw an exception and we want to verify that
      // behavior here.
      await expect(
        testRule(ruleId, rule, testDocument, true)
      ).rejects.toThrow();
    });
    it('additionalProperties schema without items property', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.additionalProperties = {
        type: 'array',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(4);
      const expectedPaths = [
        'paths./v1/movies.post.responses.201.content.application/json.schema.additionalProperties',
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.additionalProperties',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.additionalProperties',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.additionalProperties',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsgItems);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('minItems > maxItems', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['wheel_count'] = {
        type: 'array',

        items: {
          type: 'integer',
        },
        minItems: 5,
        maxItems: 4,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);
      const expectedPaths = [
        'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count',
        'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count',
        'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `'minItems' cannot be greater than 'maxItems'`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('minItems defined for non-array schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['wheel_count'] = {
        type: 'object',
        minItems: 3,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);
      const expectedPaths = [
        'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.minItems',
        'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.minItems',
        'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.minItems',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `'minItems' should not be defined for a non-array schema`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
    it('maxItems defined for non-array schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties['wheel_count'] = {
        type: 'integer',
        maxItems: 3,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);
      const expectedPaths = [
        'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.maxItems',
        'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.maxItems',
        'paths./v1/cars/{car_id}.patch.responses.200.content.application/json.schema.properties.wheel_count.maxItems',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(
          `'maxItems' should not be defined for a non-array schema`
        );
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
