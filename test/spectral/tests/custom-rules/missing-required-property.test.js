const { lastIndexOf } = require('lodash');
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
                  required: [
                    'param_prop1' // missing
                  ],
                  type: 'object',
                  properties: {
                    string_prop: {
                      type: 'string'
                    }
                  }
                }
              }
            ],
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    required: [
                      'prop1',
                      'prop2',
                      'prop3', // missing
                      'prop4' // missing
                    ],
                    type: 'object',
                    properties: {
                      prop1: {
                        type: 'object',
                        properties: {
                          p: {
                            required: [
                              'internal_prop1',
                              'internal_prop2' // missing
                            ],
                            type: 'object',
                            properties: {
                              internal_prop1: {
                                type: 'string'
                              }
                            }
                          }
                        }
                      },
                      prop2: {
                        type: 'array',
                        items: {
                          required: [
                            'items_prop1',
                            'items_prop2' // missing
                          ],
                          type: 'object',
                          properties: {
                            items_prop1: {
                              type: 'string'
                            }
                          }
                        }
                      },
                      all_of_test_prop: {
                        type: 'object',
                        required: [
                          'all_of_prop1',
                          'all_of_prop2' // missing, should be defined in at least one allOf schema
                        ],
                        allOf: [
                          {
                            type: 'object',
                            properties: {
                              all_of_prop1: {
                                type: 'string'
                              }
                            }
                          },
                          {
                            type: 'object',
                            properties: {
                              extra_prop: {
                                type: 'string'
                              }
                            }
                          }
                        ]
                      },
                      any_of_test_prop: {
                        type: 'object',
                        required: [
                          'any_of_prop1',
                          'any_of_prop2' // missing, should be defined in all schemas
                        ],
                        anyOf: [
                          {
                            type: 'object',
                            properties: {
                              any_of_prop1: {
                                type: 'string'
                              },
                              any_of_prop2: {
                                type: 'string'
                              }
                            }
                          },
                          {
                            type: 'object',
                            properties: {
                              any_of_prop1: {
                                type: 'string'
                              }
                            }
                          }
                        ]
                      },
                      one_of_test_prop: {
                        type: 'object',
                        required: [
                          'one_of_prop1',
                          'one_of_prop2' // missing, should be defined in all schemas
                        ],
                        oneOf: [
                          {
                            type: 'object',
                            properties: {
                              one_of_prop1: {
                                type: 'string'
                              },
                              one_of_prop2: {
                                type: 'string'
                              }
                            }
                          },
                          {
                            type: 'object',
                            properties: {
                              one_of_prop1: {
                                type: 'string'
                              }
                            }
                          }
                        ]
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
    const expectedErrors = res.errors.filter(
      err => err.rule === 'missing-required-property'
    );
    expect(expectedErrors.length).toBe(8);
    const expectedPathsDict = {
      param_prop1: ['paths', '/createPet', 'post', 'parameters', '0', 'schema'],
      prop3: [
        'paths',
        '/createPet',
        'post',
        'requestBody',
        'content',
        'application/json',
        'schema'
      ],
      prop4: [
        'paths',
        '/createPet',
        'post',
        'requestBody',
        'content',
        'application/json',
        'schema'
      ],
      internal_prop2: [
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
        'p'
      ],
      items_prop2: [
        'paths',
        '/createPet',
        'post',
        'requestBody',
        'content',
        'application/json',
        'schema',
        'properties',
        'prop2',
        'items'
      ],
      all_of_prop2: [
        'paths',
        '/createPet',
        'post',
        'requestBody',
        'content',
        'application/json',
        'schema',
        'properties',
        'all_of_test_prop'
      ],
      any_of_prop2: [
        'paths',
        '/createPet',
        'post',
        'requestBody',
        'content',
        'application/json',
        'schema',
        'properties',
        'any_of_test_prop'
      ],
      one_of_prop2: [
        'paths',
        '/createPet',
        'post',
        'requestBody',
        'content',
        'application/json',
        'schema',
        'properties',
        'one_of_test_prop'
      ]
    };

    expectedErrors.forEach(function(expectedError) {
      expect(expectedError.message).toMatch('Required property, ');
      const propName = expectedError.message.substring(
        19,
        lastIndexOf(expectedError.message, ',')
      );
      expect(expectedError.path).toEqual(expectedPathsDict[propName]);
    });
  });
});
