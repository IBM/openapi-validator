const { schemaDescription } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = schemaDescription;
const ruleId = 'schema-description';
const expectedSeverity = severityCodes.warning;
const expectedMsgSchema = 'Schema should have a non-empty description';
const expectedMsgProp = 'Schema property should have a non-empty description';

describe('Spectral rule: schema-description', () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
      // console.log(JSON.stringify(rootDocument, null, 2));
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
            $ref: '#/components/schemas/Juice'
          },
          {
            $ref: '#/components/schemas/Soda'
          }
        ]
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
            $ref: '#/components/schemas/Juice'
          },
          {
            $ref: '#/components/schemas/Soda'
          }
        ]
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
              type: 'string'
            }
          }
        }
      };

      testDocument.paths['/v1/movies'].get.responses['200'].content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/MovieNameList'
      };

      const results = await testRule(ruleId, rule, testDocument);
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
                    type: 'string'
                  }
                }
              },
              {
                properties: {
                  prop2: {
                    description: 'a description',
                    type: 'string'
                  }
                }
              }
            ]
          }
        }
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
                        type: 'string'
                      }
                    }
                  },
                  {
                    description: 'a description',
                    properties: {
                      prop2: {
                        description: 'a description',
                        type: 'string'
                      }
                    }
                  }
                ]
              },
              {
                properties: {
                  prop3: {
                    description: 'a description',
                    type: 'string'
                  }
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
    it('Request body schema with no description', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.requestBody.content = {
        'text/html': {
          schema: {
            type: 'string'
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgSchema);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/drinks',
        'post',
        'requestBody',
        'content',
        'text/html',
        'schema'
      ]);
    });

    it('Named schema with an empty description', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['IdString'].description = '';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(3);
      for (const result of results) {
        expect(result.code).toBe(ruleId);
        expect(result.message).toBe(expectedMsgProp);
        expect(result.severity).toBe(expectedSeverity);
      }
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/movies',
        'post',
        'requestBody',
        'content',
        'application/json',
        'schema',
        'properties',
        'id'
      ]);
      expect(results[1].path).toStrictEqual([
        'paths',
        '/v1/movies',
        'post',
        'responses',
        '201',
        'content',
        'application/json',
        'schema',
        'properties',
        'id'
      ]);
      expect(results[2].path).toStrictEqual([
        'paths',
        '/v1/movies',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'movies',
        'items',
        'properties',
        'id'
      ]);
    });

    it('Response schema with only spaces in the description', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['400'].content[
        'application/json'
      ].schema.description = '     ';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgSchema);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/movies',
        'post',
        'responses',
        '400',
        'content',
        'application/json',
        'schema'
      ]);
    });

    it('Response schema property with no description', async () => {
      const testDocument = makeCopy(rootDocument);

      // Make a copy of Movie named Movie2, and make Movie2 the response schema
      // for the create operation only.
      const movie2 = makeCopy(testDocument.components.schemas['Movie']);
      movie2.properties['director'] = {
        type: 'string'
      };
      testDocument.components.schemas['Movie2'] = movie2;
      testDocument.paths['/v1/movies'].post.responses['201'].content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/Movie2'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProp);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/movies',
        'post',
        'responses',
        '201',
        'content',
        'application/json',
        'schema',
        'properties',
        'director'
      ]);
    });

    it('Inline response schema property with only spaces in the description', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/movies'].post.responses['400'].content[
        'application/json'
      ].schema.properties['trace'].description = '     ';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProp);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/movies',
        'post',
        'responses',
        '400',
        'content',
        'application/json',
        'schema',
        'properties',
        'trace'
      ]);
    });

    it('Re-used oneOf child schema with no description', async () => {
      const testDocument = makeCopy(rootDocument);

      // Remove description from Soda schema.
      testDocument.components.schemas['Soda'].description = undefined;

      // Add another (non-oneOf) reference to the Soda schema.
      testDocument.paths['/v1/drinks'].post.responses['201'].content[
        'application/json'
      ].schema = {
        $ref: '#/components/schemas/Soda'
      };

      // We should get back a warning ONLY due to the Soda reference in the response (not the oneOf).
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgSchema);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/drinks',
        'post',
        'responses',
        '201',
        'content',
        'application/json',
        'schema'
      ]);
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
                    type: 'string'
                  }
                }
              },
              {
                properties: {
                  prop2: {
                    description: 'a description',
                    type: 'string'
                  }
                }
              }
            ]
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProp);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/drinks',
        'post',
        'responses',
        '201',
        'content',
        'application/json',
        'schema',
        'properties',
        'main_prop'
      ]);
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
                    type: 'string'
                  }
                }
              },
              {
                description: 'a description',
                properties: {
                  prop2: {
                    description: 'a description',
                    type: 'string'
                  }
                }
              }
            ]
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProp);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/drinks',
        'post',
        'responses',
        '201',
        'content',
        'application/json',
        'schema',
        'properties',
        'main_prop'
      ]);
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
                    type: 'string'
                  }
                }
              },
              {
                description: 'a description',
                properties: {
                  prop2: {
                    description: 'a description',
                    type: 'string'
                  }
                }
              }
            ]
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProp);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/drinks',
        'post',
        'responses',
        '201',
        'content',
        'application/json',
        'schema',
        'properties',
        'main_prop'
      ]);
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
                        type: 'string'
                      }
                    }
                  },
                  {
                    properties: {
                      prop1b: {
                        description: 'a description',
                        type: 'string'
                      }
                    }
                  }
                ]
              },
              {
                description: 'a description',
                properties: {
                  prop2: {
                    description: 'a description',
                    type: 'string'
                  }
                }
              }
            ]
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProp);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/drinks',
        'post',
        'responses',
        '201',
        'content',
        'application/json',
        'schema',
        'properties',
        'main_prop'
      ]);
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
                        type: 'string'
                      }
                    }
                  },
                  {
                    properties: {
                      prop1b: {
                        description: 'a description',
                        type: 'string'
                      }
                    }
                  }
                ]
              },
              {
                description: 'a description',
                properties: {
                  prop2: {
                    description: 'a description',
                    type: 'string'
                  }
                }
              }
            ]
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgProp);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path).toStrictEqual([
        'paths',
        '/v1/drinks',
        'post',
        'responses',
        '201',
        'content',
        'application/json',
        'schema',
        'properties',
        'main_prop'
      ]);
    });
  });
});
