const expect = require('expect');
const resolver = require('json-schema-ref-parser');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/operations-shared');

const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - operations-shared', function() {
  describe('Swagger 2', function() {
    it('should complain about a non-unique (name + in combination) parameters', function() {
      const spec = {
        paths: {
          '/': {
            get: {
              operationId: 'get_everything',
              summary: 'this is a summary',
              parameters: [
                {
                  name: 'test',
                  in: 'query',
                  description: 'just a test param',
                  type: 'string'
                },
                {
                  name: 'test',
                  in: 'query',
                  description: 'another test param',
                  type: 'string'
                }
              ]
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual('paths./.get.parameters[1]');
      expect(res.errors[0].message).toEqual(
        "Operation parameters must have unique 'name' + 'in' properties"
      );
      expect(res.warnings.length).toEqual(0);
    });

    it('should complain about a missing operationId', function() {
      const spec = {
        paths: {
          '/CoolPath': {
            put: {
              consumes: ['consumes'],
              summary: 'this is a summary',
              parameters: [
                {
                  name: 'BadParameter',
                  in: 'body',
                  schema: {
                    required: ['Property'],
                    properties: [
                      {
                        name: 'Property'
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].path).toEqual('paths./CoolPath.put.operationId');
      expect(res.warnings[0].message).toEqual(
        'Operations must have a non-empty `operationId`.'
      );
      expect(res.errors.length).toEqual(0);
    });

    it('should complain about an empty operationId', function() {
      const spec = {
        paths: {
          '/CoolPath': {
            put: {
              consumes: ['consumes'],
              summary: 'this is a summary',
              operationId: ' ',
              parameters: [
                {
                  name: 'BadParameter',
                  in: 'body',
                  schema: {
                    required: ['Property'],
                    properties: [
                      {
                        name: 'Property'
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].path).toEqual('paths./CoolPath.put.operationId');
      expect(res.warnings[0].message).toEqual(
        'Operations must have a non-empty `operationId`.'
      );
      expect(res.errors.length).toEqual(0);
    });

    it('should complain about a missing summary', function() {
      const spec = {
        paths: {
          '/CoolPath': {
            put: {
              consumes: ['consumes'],
              operationId: 'operation_id',
              parameters: [
                {
                  name: 'BadParameter',
                  in: 'body',
                  schema: {
                    required: ['Property'],
                    properties: [
                      {
                        name: 'Property'
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].path).toEqual('paths./CoolPath.put.summary');
      expect(res.warnings[0].message).toEqual(
        'Operations must have a non-empty `summary` field.'
      );
      expect(res.errors.length).toEqual(0);
    });

    it('should complain about an empty summary', function() {
      const spec = {
        paths: {
          '/CoolPath': {
            put: {
              consumes: ['consumes'],
              summary: '  ',
              operationId: 'operation_id',
              parameters: [
                {
                  name: 'BadParameter',
                  in: 'body',
                  schema: {
                    required: ['Property'],
                    properties: [
                      {
                        name: 'Property'
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].path).toEqual('paths./CoolPath.put.summary');
      expect(res.warnings[0].message).toEqual(
        'Operations must have a non-empty `summary` field.'
      );
      expect(res.errors.length).toEqual(0);
    });

    it('should not complain about anything when x-sdk-exclude is true', function() {
      const spec = {
        paths: {
          '/CoolPath': {
            put: {
              'x-sdk-exclude': true,
              summary: '  ',
              parameters: [
                {
                  name: 'BadParameter',
                  in: 'body',
                  schema: {
                    required: ['Property'],
                    properties: [
                      {
                        name: 'Property'
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(0);
    });

    it('should complain about an anonymous array response model', function() {
      const spec = {
        paths: {
          '/stuff': {
            get: {
              summary: 'list stuff',
              operationId: 'list_stuff',
              produces: ['application/json'],
              responses: {
                200: {
                  description: 'successful operation',
                  schema: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(
        'paths./stuff.get.responses.200.schema'
      );
      expect(res.errors[0].message).toEqual(
        'Arrays MUST NOT be returned as the top-level structure in a response body.'
      );
      expect(res.warnings.length).toEqual(0);
    });

    it('should complain about an anonymous array response model - from a $ref', async function() {
      const spec = {
        paths: {
          '/stuff': {
            post: {
              summary: 'list stuff',
              operationId: 'list_stuff',
              produces: ['application/json'],
              responses: {
                200: {
                  description: 'successful operation',
                  schema: {
                    $ref: '#/responses/Success'
                  }
                }
              }
            }
          }
        },
        responses: {
          Success: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      };

      const resolvedSpec = await resolver.dereference(spec);

      const res = validate({ resolvedSpec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(
        'paths./stuff.post.responses.200.schema'
      );
      expect(res.errors[0].message).toEqual(
        'Arrays MUST NOT be returned as the top-level structure in a response body.'
      );
      expect(res.warnings.length).toEqual(0);
    });

    it('should complain about an anonymous array response model with no type but an `items` field', function() {
      const spec = {
        paths: {
          '/stuff': {
            get: {
              summary: 'list stuff',
              operationId: 'list_stuff',
              produces: ['application/json'],
              responses: {
                200: {
                  description: 'successful operation',
                  schema: {
                    items: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(
        'paths./stuff.get.responses.200.schema'
      );
      expect(res.errors[0].message).toEqual(
        'Arrays MUST NOT be returned as the top-level structure in a response body.'
      );
      expect(res.warnings.length).toEqual(0);
    });

    it('should not complain about an empty summary within a vendor extension', function() {
      const spec = {
        paths: {
          '/CoolPath': {
            'x-vendor-put-op': {
              consumes: ['consumes'],
              summary: '  ',
              operationId: 'operation_id',
              parameters: [
                {
                  name: 'BadParameter',
                  in: 'body',
                  schema: {
                    required: ['Property'],
                    properties: [
                      {
                        name: 'Property'
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(0);
    });

    it('should report required parameters before optional parameters', function() {
      const spec = {
        paths: {
          '/stuff': {
            get: {
              summary: 'list stuff',
              operationId: 'list_stuff',
              produces: ['application/json'],
              parameters: [
                {
                  name: 'foo',
                  in: 'query',
                  type: 'string'
                },
                {
                  name: 'bar',
                  in: 'query',
                  type: 'string',
                  required: true
                },
                {
                  name: 'baz',
                  in: 'query',
                  type: 'string',
                  required: true
                }
              ]
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.warnings.length).toEqual(2);
      expect(res.warnings[0].path).toEqual('paths./stuff.get.parameters[1]');
      expect(res.warnings[0].message).toEqual(
        'Required parameters should appear before optional parameters.'
      );
      expect(res.warnings[1].path).toEqual('paths./stuff.get.parameters[2]');
      expect(res.warnings[1].message).toEqual(
        'Required parameters should appear before optional parameters.'
      );
    });

    it('should report required ref parameters before optional ref parameters', async function() {
      const spec = {
        paths: {
          '/stuff': {
            get: {
              summary: 'list stuff',
              operationId: 'list_stuff',
              produces: ['application/json'],
              parameters: [
                {
                  $ref: '#/parameters/fooParam'
                },
                {
                  $ref: '#/parameters/barParam'
                },
                {
                  $ref: '#/parameters/bazParam'
                }
              ]
            }
          }
        },
        parameters: {
          fooParam: {
            name: 'foo',
            in: 'query',
            type: 'string'
          },
          barParam: {
            name: 'bar',
            in: 'query',
            type: 'string',
            required: true
          },
          bazParam: {
            name: 'foo',
            in: 'query',
            type: 'string',
            required: true
          }
        }
      };

      const resolvedSpec = await resolver.dereference(spec);

      const res = validate({ resolvedSpec }, config);
      expect(res.warnings.length).toEqual(2);
      expect(res.warnings[0].path).toEqual('paths./stuff.get.parameters[1]');
      expect(res.warnings[0].message).toEqual(
        'Required parameters should appear before optional parameters.'
      );
      expect(res.warnings[1].path).toEqual('paths./stuff.get.parameters[2]');
      expect(res.warnings[1].message).toEqual(
        'Required parameters should appear before optional parameters.'
      );
    });

    it('should not complain if required ref parameters appear before a required parameter', async function() {
      const spec = {
        paths: {
          '/fake/{id}': {
            get: {
              summary: 'get fake data by id',
              operationId: 'get_fake_data',
              produces: ['application/json'],
              parameters: [
                {
                  $ref: '#/parameters/Authorization'
                },
                {
                  $ref: '#/parameters/ProjectId'
                },
                {
                  name: 'id',
                  in: 'path',
                  type: 'string',
                  required: true,
                  description: 'something'
                }
              ]
            }
          }
        },
        parameters: {
          Authorization: {
            name: 'Authorization',
            in: 'header',
            description: 'Identity Access Management (IAM) bearer token.',
            required: true,
            type: 'string',
            default: 'Bearer <token>'
          },
          ProjectId: {
            name: 'project_id',
            in: 'query',
            description: 'The ID of the project to use.',
            required: true,
            type: 'string'
          },
          XOpenIDToken: {
            name: 'X-OpenID-Connect-ID-Token',
            in: 'header',
            description: 'UAA token.',
            required: true,
            type: 'string',
            default: '<token>'
          }
        }
      };

      const resolvedSpec = await resolver.dereference(spec);

      const res = validate({ resolvedSpec }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(0);
    });

    it('should be able to handle parameters with `.` characters in the name', async function() {
      const spec = {
        paths: {
          '/fake/{id}': {
            get: {
              summary: 'get fake data by id',
              operationId: 'get_fake_data',
              produces: ['application/json'],
              parameters: [
                {
                  $ref: '#/parameters/Authorization'
                },
                {
                  $ref: '#/parameters/Project.Id'
                },
                {
                  name: 'id',
                  in: 'path',
                  type: 'string',
                  required: true,
                  description: 'something'
                }
              ]
            }
          }
        },
        parameters: {
          Authorization: {
            name: 'Authorization',
            in: 'header',
            description: 'Identity Access Management (IAM) bearer token.',
            required: true,
            type: 'string',
            default: 'Bearer <token>'
          },
          'Project.Id': {
            name: 'project_id',
            in: 'query',
            description: 'The ID of the project to use.',
            required: true,
            type: 'string'
          },
          XOpenIDToken: {
            name: 'X-OpenID-Connect-ID-Token',
            in: 'header',
            description: 'UAA token.',
            required: true,
            type: 'string',
            default: '<token>'
          }
        }
      };

      const resolvedSpec = await resolver.dereference(spec);

      const res = validate({ resolvedSpec }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(0);
    });

    it('should complain about an operationId with the wrong case', function() {
      const spec = {
        paths: {
          '/CoolPath': {
            put: {
              consumes: ['consumes'],
              summary: 'this is a summary',
              operationId: 'coolPathPut',
              parameters: [
                {
                  name: 'BadParameter',
                  in: 'body',
                  schema: {
                    required: ['Property'],
                    properties: [
                      {
                        name: 'Property'
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].path).toEqual('paths./CoolPath.put.operationId');
      expect(res.warnings[0].message).toEqual(
        'operationIds must follow case convention: lower_snake_case'
      );
      expect(res.errors.length).toEqual(0);
    });

    it('should not complain about a valid operationId', function() {
      const spec = {
        paths: {
          '/CoolPath': {
            put: {
              consumes: ['consumes'],
              summary: 'this is a summary',
              operationId: 'cool_path_put',
              parameters: [
                {
                  name: 'BadParameter',
                  in: 'body',
                  schema: {
                    required: ['Property'],
                    properties: [
                      {
                        name: 'Property'
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(0);
    });
  });

  describe('OpenAPI 3', function() {
    it('should complain about a non-unique (name + in combination) parameters', async function() {
      const spec = {
        components: {
          parameters: {
            RefParam: {
              name: 'test',
              in: 'query',
              description: 'referenced test param',
              schema: {
                type: 'string'
              }
            }
          }
        },
        paths: {
          '/': {
            get: {
              operationId: 'get_everything',
              summary: 'this is a summary',
              responses: {
                default: {
                  description: 'default response',
                  'text/plain': {
                    schema: {
                      type: 'string'
                    }
                  }
                }
              },
              parameters: [
                {
                  $ref: '#/components/parameters/RefParam'
                },
                {
                  name: 'test',
                  in: 'query',
                  description: 'another test param',
                  schema: {
                    type: 'string'
                  }
                }
              ]
            }
          }
        }
      };

      const resolvedSpec = await resolver.dereference(spec);

      const res = validate({ resolvedSpec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual('paths./.get.parameters[1]');
      expect(res.errors[0].message).toEqual(
        "Operation parameters must have unique 'name' + 'in' properties"
      );
      expect(res.warnings.length).toEqual(0);
    });

    it('should complain about a top-level array response', function() {
      const spec = {
        paths: {
          '/': {
            put: {
              operationId: 'get_everything',
              summary: 'get everything as a string or an array',
              requestBody: {
                description: 'simple body',
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
                    }
                  }
                }
              },
              responses: {
                '200': {
                  content: {
                    'text/plain': {
                      schema: {
                        type: 'string'
                      }
                    },
                    'application/json': {
                      schema: {
                        type: 'array',
                        items: {
                          type: 'string'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(
        'paths./.put.responses.200.content.application/json.schema'
      );
      expect(res.errors[0].message).toEqual(
        'Arrays MUST NOT be returned as the top-level structure in a response body.'
      );
      expect(res.warnings.length).toEqual(0);
    });

    it('should complain about a top-level array response without a type but with an `items` field', function() {
      const spec = {
        paths: {
          '/': {
            put: {
              operationId: 'get_everything',
              summary: 'get everything as a string or an array',
              requestBody: {
                description: 'simple body',
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
                    }
                  }
                }
              },
              responses: {
                '200': {
                  content: {
                    'text/plain': {
                      schema: {
                        type: 'string'
                      }
                    },
                    'application/json': {
                      schema: {
                        items: {
                          type: 'string'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(
        'paths./.put.responses.200.content.application/json.schema'
      );
      expect(res.errors[0].message).toEqual(
        'Arrays MUST NOT be returned as the top-level structure in a response body.'
      );
      expect(res.warnings.length).toEqual(0);
    });

    it('should complain about an unused tag', function() {
      const spec = {
        tags: [
          {
            name: 'some tag'
          },
          {
            name: 'some unused tag'
          }
        ],
        paths: {
          '/': {
            get: {
              operationId: 'get_everything',
              tags: ['some tag'],
              summary: 'get everything as a string',
              responses: {
                '200': {
                  content: {
                    'text/plain': {
                      schema: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(1);

      expect(res.warnings[0].path).toEqual('tags');
      expect(res.warnings[0].message).toEqual(
        'A tag is defined but never used: some unused tag'
      );
    });

    it('should complain about an undefined tag', function() {
      const spec = {
        tags: [
          {
            name: 'some tag'
          }
        ],
        paths: {
          '/': {
            get: {
              operationId: 'get_everything',
              tags: ['not a tag'],
              summary: 'get everything as a string',
              responses: {
                '200': {
                  content: {
                    'text/plain': {
                      schema: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            },
            post: {
              operationId: 'post_everything',
              tags: ['some tag'],
              summary: 'post everything as a string',
              responses: {
                '200': {
                  content: {
                    'text/plain': {
                      schema: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(1);

      expect(res.warnings[0].path).toEqual('paths./.get.tags');
      expect(res.warnings[0].message).toEqual(
        'tag is not defined at the global level: not a tag'
      );
    });

    it('should complain about a $ref in an operation', function() {
      const jsSpec = {
        paths: {
          '/resource': {
            post: {
              $ref: 'external.yaml#/some-post'
            }
          }
        }
      };

      const resolvedSpec = {
        paths: {
          '/resource': {
            post: {
              description: 'illegally referenced operation',
              operationId: 'create_resource',
              summary: 'simple operation'
            }
          }
        }
      };

      const res = validate({ jsSpec, resolvedSpec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.warnings.length).toEqual(0);

      expect(res.errors[0].path).toEqual('paths./resource.post.$ref');
      expect(res.errors[0].message).toEqual('$ref found in illegal location');
    });
  });
});
