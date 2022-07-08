const { arrayBoundary } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = arrayBoundary;
const ruleId = 'array-boundary';
const expectedSeverity = severityCodes.warning;
const expectedMsgMin = 'Array schemas should define a numeric minItems field';
const expectedMsgMax = 'Array schemas should define a numeric maxItems field';

describe('Spectral rule: array-boundary', () => {
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
                  type: 'string'
                }
              },
              {
                type: 'array',
                minItems: 12,
                maxItems: 42
              }
            ]
          }
        }
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
                    maxItems: 100000
                  },
                  {
                    type: 'array',
                    minItems: 100001,
                    maxItems: 100500
                  }
                ]
              },
              {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            ]
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Response schema array property with no min/maxItems', async () => {
      const testDocument = makeCopy(rootDocument);

      // Make a copy of Movie named Movie2, and make Movie2 the response schema
      // for the create operation only.
      const movie2 = makeCopy(testDocument.components.schemas['Movie']);
      movie2.properties['production_crew'] = {
        type: 'array',
        items: {
          type: 'string'
        }
      };
      testDocument.components.schemas['Movie2'] = movie2;
      testDocument.paths['/v1/movies'].post.responses['201'].content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/Movie2'
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
          trace: {
            description: 'array containing each line of a stack trace',
            type: 'array',
            minItems: 1,
            items: {
              type: 'string',
              format: 'uuid'
            }
          },
          error: {
            $ref: '#/components/schemas/RequestError'
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgMax);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.responses.400.content.application/json.schema.properties.trace'
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
                  type: 'string'
                }
              },
              {
                type: 'array'
              }
            ]
          }
        }
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
                  type: 'string'
                },
                minItems: 0
              },
              {
                type: 'array',
                items: {
                  type: 'string'
                },
                maxItems: 5
              }
            ]
          }
        }
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
                  type: 'string'
                },
                minItems: 0
              },
              {
                type: 'array',
                items: {
                  type: 'string'
                },
                maxItems: 5
              }
            ]
          }
        }
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
                    maxItems: 4
                  },
                  {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                ]
              },
              {
                type: 'array',
                minItems: 0,
                items: {
                  type: 'string'
                }
              }
            ]
          }
        }
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
                    maxItems: 4
                  },
                  {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                ]
              },
              {
                type: 'array',
                maxItems: 1600,
                items: {
                  type: 'string'
                }
              }
            ]
          }
        }
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
  });
});
