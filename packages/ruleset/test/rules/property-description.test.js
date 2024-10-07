/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { propertyDescriptionExists } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = propertyDescriptionExists;
const ruleId = 'ibm-property-description';
const expectedSeverity = severityCodes.warning;
const expectedMsg = 'Schema properties should have a non-empty description';

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Schema property w/ description in allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        description: 'Drink response schema',
        properties: {
          main_prop: {
            allOf: [
              {
                description: 'a description',
                properties: {
                  prop1: {
                    description: 'a description',
                    type: 'string',
                  },
                },
              },
              {
                properties: {
                  prop2: {
                    description: 'a description',
                    type: 'string',
                  },
                },
              },
            ],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Schema property uses nested allOf/oneOf w/descriptions', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        description: 'Drink response schema',
        properties: {
          main_prop: {
            // At least one of the allOf schemas should have a description.
            allOf: [
              {
                // Each of the oneOf schemas should have a description.
                oneOf: [
                  {
                    description: 'a description',
                    properties: {
                      prop1: {
                        description: 'a description',
                        type: 'string',
                      },
                    },
                  },
                  {
                    description: 'a description',
                    properties: {
                      prop2: {
                        description: 'a description',
                        type: 'string',
                      },
                    },
                  },
                ],
              },
              {
                properties: {
                  prop3: {
                    description: 'a description',
                    type: 'string',
                  },
                },
              },
            ],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Response schema property with no description', async () => {
      const testDocument = makeCopy(rootDocument);

      // Make a copy of Movie named Movie2, and make Movie2 the response schema
      // for the create operation only.
      const movie2 = makeCopy(testDocument.components.schemas['Movie']);
      movie2.properties['director'] = {
        type: 'string',
      };
      testDocument.components.schemas['Movie2'] = movie2;
      testDocument.paths['/v1/movies'].post.responses['201'].content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/Movie2',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsg);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.director'
      );
    });

    it('Inline response schema property with only spaces in the description', async () => {
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
            maxItems: 100,
            description:
              'The array of error entries associated with the error response',
            items: {
              $ref: '#/components/schemas/Error',
            },
          },
          trace: {
            description: '   ',
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
        'paths./v1/movies.post.responses.400.content.application/json.schema.properties.trace'
      );
    });

    it('Named schema with an empty description', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['IdString'].description = '';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(7);

      const expectedPaths = [
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.properties.id',
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.id',
        'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.properties.id',
        'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.id',
        'paths./v1/movies.post.responses.201.content.application/json.schema.properties.id',
        'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.id',
        'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.id',
      ];
      for (let i = 0; i < results.length; i++) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toMatch(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('Schema property uses allOf w/no descriptions', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        description: 'a description',
        properties: {
          main_prop: {
            allOf: [
              {
                properties: {
                  prop1: {
                    description: 'a description',
                    type: 'string',
                  },
                },
              },
              {
                properties: {
                  prop2: {
                    description: 'a description',
                    type: 'string',
                  },
                },
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
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.main_prop'
      );
    });

    it('Schema property uses oneOf w/missing descriptions', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        description: 'a description',
        properties: {
          main_prop: {
            oneOf: [
              {
                properties: {
                  prop1: {
                    description: 'a description',
                    type: 'string',
                  },
                },
              },
              {
                description: 'a description',
                properties: {
                  prop2: {
                    description: 'a description',
                    type: 'string',
                  },
                },
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
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.main_prop'
      );
    });

    it('Schema property uses anyOf w/missing descriptions', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        description: 'a description',
        properties: {
          main_prop: {
            anyOf: [
              {
                properties: {
                  prop1: {
                    description: 'a description',
                    type: 'string',
                  },
                },
              },
              {
                description: 'a description',
                properties: {
                  prop2: {
                    description: 'a description',
                    type: 'string',
                  },
                },
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
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.main_prop'
      );
    });

    it('Schema property uses nested allOf/oneOf w/missing descriptions', async () => {
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
                    properties: {
                      prop1a: {
                        description: 'a description',
                        type: 'string',
                      },
                    },
                  },
                  {
                    properties: {
                      prop1b: {
                        description: 'a description',
                        type: 'string',
                      },
                    },
                  },
                ],
              },
              {
                description: 'a description',
                properties: {
                  prop2: {
                    description: 'a description',
                    type: 'string',
                  },
                },
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
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.main_prop'
      );
    });

    it('Schema property uses nested allOf/anyOf w/missing descriptions', async () => {
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
                    properties: {
                      prop1a: {
                        description: 'a description',
                        type: 'string',
                      },
                    },
                  },
                  {
                    properties: {
                      prop1b: {
                        description: 'a description',
                        type: 'string',
                      },
                    },
                  },
                ],
              },
              {
                description: 'a description',
                properties: {
                  prop2: {
                    description: 'a description',
                    type: 'string',
                  },
                },
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
        'paths./v1/drinks.post.responses.201.content.application/json.schema.properties.main_prop'
      );
    });
  });
});
