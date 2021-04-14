const addPathsToComponents = require('../../../../src/cli-validator/utils/addPathsToComponents');

describe('test postprocessing util - test component path finding', function() {
  it('should correctly add component paths', function() {
    const unresolvedSpec = {
      paths: {
        '/path1': {
          get: {
            responses: {
              '200': {
                $ref: '#/components/responses/GenericResponse'
              },
              '201': {
                $ref: '#/components/responses/GenericResponse'
              }
            }
          }
        }
      },
      components: {
        responses: {
          GenericResponse: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/GenericSchema'
                }
              }
            }
          }
        },
        schemas: {
          GenericSchema: {
            type: 'object',
            properties: {
              stringProp: {
                type: 'string'
              }
            }
          }
        }
      }
    };
    // mimicing errors from a resolved spec
    const originalResults = {
      errors: {
        'validator-name': [
          {
            message: 'simple error message',
            path:
              'paths./path1.get.responses.200.content.application/json.schema.properties.stringProp',
            rule: 'made_up_rule'
          },
          {
            message: 'simple error message',
            path:
              'paths./path1.get.responses.201.content.application/json.schema.properties.stringProp',
            rule: 'made_up_rule'
          }
        ]
      }
    };
    addPathsToComponents(originalResults, unresolvedSpec);
    const errors = originalResults.errors['validator-name'];
    expect(errors.length).toBe(2);
    expect(errors[0].componentPath).toEqual([
      'components',
      'schemas',
      'GenericSchema',
      'properties',
      'stringProp'
    ]);
    expect(errors[1].componentPath).toEqual([
      'components',
      'schemas',
      'GenericSchema',
      'properties',
      'stringProp'
    ]);
  });

  it('should correctly add component paths when an array index is in the path', function() {
    const unresolvedSpec = {
      paths: {
        '/path1': {
          post: {
            requestBody: {
              $ref: '#/components/requestBodies/OneOfRequest'
            }
          }
        }
      },
      components: {
        requestBodies: {
          OneOfRequest: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OneOfSchema'
                }
              }
            }
          }
        },
        schemas: {
          OneOfSchema: {
            oneOf: [
              {
                $ref: '#/components/schemas/Cat'
              },
              {
                $ref: '#/components/schemas/Dog'
              }
            ]
          },
          Cat: {
            type: 'object',
            properties: {
              meows: {
                type: 'boolean'
              }
            }
          },
          Dog: {
            type: 'object',
            properties: {
              barks: {
                type: 'boolean'
              }
            }
          }
        }
      }
    };
    // mimicing errors from a resolved spec
    const originalResults = {
      errors: {
        'validator-name': [
          {
            message: 'simple error message',
            path:
              'paths./path1.post.requestBody.content.application/json.schema.oneOf.0.properties.meows',
            rule: 'made_up_rule'
          },
          {
            message: 'simple error message with array path',
            path: [
              'paths',
              '/path1',
              'post',
              'requestBody',
              'content',
              'application/json',
              'schema',
              'oneOf',
              '0',
              'properties',
              'meows'
            ],
            rule: 'made_up_rule'
          },
          {
            message: 'simple error message with array path with a number index',
            path: [
              'paths',
              '/path1',
              'post',
              'requestBody',
              'content',
              'application/json',
              'schema',
              'oneOf',
              0,
              'properties',
              'meows'
            ],
            rule: 'made_up_rule'
          }
        ]
      }
    };
    addPathsToComponents(originalResults, unresolvedSpec);
    const errors = originalResults.errors['validator-name'];
    expect(errors.length).toBe(3);
    expect(errors[0].componentPath).toEqual([
      'components',
      'schemas',
      'Cat',
      'properties',
      'meows'
    ]);
    expect(errors[1].componentPath).toEqual([
      'components',
      'schemas',
      'Cat',
      'properties',
      'meows'
    ]);
    expect(errors[2].componentPath).toEqual([
      'components',
      'schemas',
      'Cat',
      'properties',
      'meows'
    ]);
  });

  it('should not add a component path when the error path is invalid', function() {
    const unresolvedSpec = {
      paths: {
        '/path1': {
          get: {
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/GenericSchema'
                    }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        schemas: {
          GenericSchema: {
            type: 'string'
          }
        }
      }
    };
    // invalid error path
    const originalResults = {
      errors: {
        'validator-name': [
          {
            message: 'simple error message',
            path:
              'paths./path1.get.requestBody.content.application/json.schema',
            rule: 'made_up_rule'
          }
        ]
      }
    };
    addPathsToComponents(originalResults, unresolvedSpec);
    const errors = originalResults.errors['validator-name'];
    expect(errors.length).toBe(1);
    expect(errors[0].componentPath).toBeUndefined();
  });

  it('should not add a component path when the ref is invalid', function() {
    const unresolvedSpec = {
      paths: {
        '/path1': {
          get: {
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/SchemaDoesntExist'
                    }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        schemas: {
          GenericSchema: {
            type: 'object',
            properties: {
              stringProp: {
                type: 'string'
              }
            }
          }
        }
      }
    };

    // invalid error path
    const originalResults = {
      errors: {
        'validator-name': [
          {
            message: 'simple error message',
            path:
              'paths./path1.get.responses.200.content.application/json.schema.stringProp',
            rule: 'made_up_rule'
          }
        ]
      }
    };

    addPathsToComponents(originalResults, unresolvedSpec);
    const errors = originalResults.errors['validator-name'];
    expect(errors.length).toBe(1);
    expect(errors[0].componentPath).toBeUndefined();
  });

  it('should not add a component path when the ref is invalid', function() {
    const unresolvedSpec = {
      swagger: '2.0',
      paths: {
        '/pet': {
          post: {
            description: 'post a pet to store',
            operationId: 'opId',
            produces: ['application/json'],
            parameters: [
              {
                in: 'body',
                name: 'body',
                description: 'Pet object that needs to be added to the store',
                required: true,
                schema: {
                  $ref: '#/definitions/Pet'
                }
              }
            ]
          }
        }
      },
      definitions: {
        Pet: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64'
            },
            name: {
              type: 'string',
              description: 'string'
            }
          }
        }
      }
    };

    const originalResults = {
      errors: {
        'validator-name': [
          {
            message: 'simple error message',
            path: 'paths./pet.post.parameters.0.schema.properties.id',
            rule: 'made_up_rule'
          }
        ]
      }
    };

    addPathsToComponents(originalResults, unresolvedSpec);
    const errors = originalResults.errors['validator-name'];
    expect(errors.length).toBe(1);
    expect(errors[0].componentPath).toEqual([
      'definitions',
      'Pet',
      'properties',
      'id'
    ]);
  });
});
