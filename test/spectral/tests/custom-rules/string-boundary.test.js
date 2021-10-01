const inCodeValidator = require('../../../../src/lib');

describe('spectral - test validation that required properties are in the schema', function() {
  it('should error only when required property is missing', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        description:
          'This is a sample server Petstore server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters.',
        version: '1.0.0',
        title: 'Swagger Petstore'
      },
      paths: {
        '/createPet': {
          post: {
            operationId: 'addPet',
            parameters: [
              {
                name: 'param1',
                in: 'query',
                schema: {
                  type: 'string',
                  pattern: '[a-zA-Z0-9]+',
                  minLength: 1,
                  maxLength: 30
                }
              },
              {
                name: 'param2',
                in: 'query',
                schema: {
                  type: 'string' // missing pattern, minLength, maxLength
                }
              }
            ],
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      prop1: {
                        type: 'object',
                        properties: {
                          date_prop1: {
                            type: 'string',
                            format: 'date',
                            minLength: 0, // minLength 0 should not cause error
                            maxLength: 10
                          },
                          string_prop2: {
                            type: 'string' // missing pattern, minLength, maxLength
                          },
                          string_prop3: {
                            type: 'string',
                            pattern: '[a-zA-Z0-9]+',
                            minLength: 1, // minLength greater than maxLength
                            maxLength: 0
                          },
                          array_prop: {
                            type: 'array',
                            items: {
                              type: 'object',
                              anyOf: [
                                {
                                  type: 'object',
                                  properties: {
                                    any_of_prop1: {
                                      type: 'string',
                                      enum: ['enum1'] // valid, enum defined
                                    },
                                    any_of_prop2: {
                                      type: 'string' // missing pattern, minLength, maxLength
                                    }
                                  }
                                },
                                {
                                  type: 'string' // missing pattern, minLength, maxLength
                                }
                              ]
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            responses: {
              '201': {
                description: 'pet created'
              }
            }
          }
        }
      }
    };

    const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.warnings.filter(
      err => err.rule === 'string-boundary'
    );

    expect(expectedWarnings.length).toBe(13); // 4 props x 3 warnings per prop

    expect(expectedWarnings[0].message).toBe(
      'Should define a pattern for a valid string'
    );
    expect(expectedWarnings[0].path).toEqual([
      'paths',
      '/createPet',
      'post',
      'parameters',
      '1',
      'schema'
    ]);
    expect(expectedWarnings[1].message).toBe(
      'Should define a minLength for a valid string'
    );
    expect(expectedWarnings[1].path).toEqual([
      'paths',
      '/createPet',
      'post',
      'parameters',
      '1',
      'schema'
    ]);
    expect(expectedWarnings[2].message).toBe(
      'Should define a maxLength for a valid string'
    );
    expect(expectedWarnings[2].path).toEqual([
      'paths',
      '/createPet',
      'post',
      'parameters',
      '1',
      'schema'
    ]);

    expect(expectedWarnings[3].message).toBe(
      'Should define a pattern for a valid string'
    );
    expect(expectedWarnings[3].path).toEqual([
      'paths',
      '/createPet',
      'post',
      'requestBody',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1',
      'properties',
      'string_prop2'
    ]);
    expect(expectedWarnings[4].message).toBe(
      'Should define a minLength for a valid string'
    );
    expect(expectedWarnings[4].path).toEqual([
      'paths',
      '/createPet',
      'post',
      'requestBody',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1',
      'properties',
      'string_prop2'
    ]);
    expect(expectedWarnings[5].message).toBe(
      'Should define a maxLength for a valid string'
    );
    expect(expectedWarnings[5].path).toEqual([
      'paths',
      '/createPet',
      'post',
      'requestBody',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1',
      'properties',
      'string_prop2'
    ]);
    expect(expectedWarnings[6].message).toBe(
      'minLength must be less than maxLength'
    );
    expect(expectedWarnings[6].path).toEqual([
      'paths',
      '/createPet',
      'post',
      'requestBody',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1',
      'properties',
      'string_prop3'
    ]);
    expect(expectedWarnings[7].message).toBe(
      'Should define a pattern for a valid string'
    );
    expect(expectedWarnings[7].path).toEqual([
      'paths',
      '/createPet',
      'post',
      'requestBody',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1',
      'properties',
      'array_prop',
      'items',
      'anyOf',
      '0',
      'properties',
      'any_of_prop2'
    ]);
    expect(expectedWarnings[8].message).toBe(
      'Should define a minLength for a valid string'
    );
    expect(expectedWarnings[8].path).toEqual([
      'paths',
      '/createPet',
      'post',
      'requestBody',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1',
      'properties',
      'array_prop',
      'items',
      'anyOf',
      '0',
      'properties',
      'any_of_prop2'
    ]);
    expect(expectedWarnings[9].message).toBe(
      'Should define a maxLength for a valid string'
    );
    expect(expectedWarnings[9].path).toEqual([
      'paths',
      '/createPet',
      'post',
      'requestBody',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1',
      'properties',
      'array_prop',
      'items',
      'anyOf',
      '0',
      'properties',
      'any_of_prop2'
    ]);

    expect(expectedWarnings[10].message).toBe(
      'Should define a pattern for a valid string'
    );
    expect(expectedWarnings[10].path).toEqual([
      'paths',
      '/createPet',
      'post',
      'requestBody',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1',
      'properties',
      'array_prop',
      'items',
      'anyOf',
      '1'
    ]);
    expect(expectedWarnings[11].message).toBe(
      'Should define a minLength for a valid string'
    );
    expect(expectedWarnings[11].path).toEqual([
      'paths',
      '/createPet',
      'post',
      'requestBody',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1',
      'properties',
      'array_prop',
      'items',
      'anyOf',
      '1'
    ]);
    expect(expectedWarnings[12].message).toBe(
      'Should define a maxLength for a valid string'
    );
    expect(expectedWarnings[12].path).toEqual([
      'paths',
      '/createPet',
      'post',
      'requestBody',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1',
      'properties',
      'array_prop',
      'items',
      'anyOf',
      '1'
    ]);
  });
});
