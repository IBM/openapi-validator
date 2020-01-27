const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/swagger2/semantic-validators/operations-ibm');

describe('validation plugin - semantic - operations-ibm - swagger2', function() {
  it('should complain about PUT operation with body parameter and a missing consumes', function() {
    const config = {
      operations: {
        no_consumes_for_put_or_post: 'error'
      }
    };

    const spec = {
      paths: {
        '/CoolPath': {
          put: {
            summary: 'this is a summary',
            operationId: 'operationId',
            produces: ['application/json'],
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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual('paths./CoolPath.put.consumes');
    expect(res.errors[0].message).toEqual(
      'PUT and POST operations with a body parameter must have a non-empty `consumes` field.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain about POST operation with body parameter and a missing consumes', function() {
    const config = {
      operations: {
        no_consumes_for_put_or_post: 'error'
      }
    };

    const spec = {
      paths: {
        '/CoolPath': {
          post: {
            consumes: [' '],
            produces: ['application/json'],
            summary: 'this is a summary',
            operationId: 'operationId',
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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual('paths./CoolPath.post.consumes');
    expect(res.errors[0].message).toEqual(
      'PUT and POST operations with a body parameter must have a non-empty `consumes` field.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain about PUT opeartion with body parameter in path and a missing consumes', function() {
    const config = {
      operations: {
        no_consumes_for_put_or_post: 'error'
      }
    };

    const spec = {
      paths: {
        '/CoolPath': {
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
          ],
          put: {
            consumes: [' '],
            produces: ['application/json'],
            summary: 'this is a summary',
            operationId: 'operationId'
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual('paths./CoolPath.put.consumes');
    expect(res.errors[0].message).toEqual(
      'PUT and POST operations with a body parameter must have a non-empty `consumes` field.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain about POST opeartion with body parameter in path and a missing consumes', function() {
    const config = {
      operations: {
        no_consumes_for_put_or_post: 'error'
      }
    };

    const spec = {
      paths: {
        '/CoolPath': {
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
          ],
          post: {
            consumes: [' '],
            produces: ['application/json'],
            summary: 'this is a summary',
            operationId: 'operationId'
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual('paths./CoolPath.post.consumes');
    expect(res.errors[0].message).toEqual(
      'PUT and POST operations with a body parameter must have a non-empty `consumes` field.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should not complain about missing consumes when there is no body parameter', function() {
    const config = {
      operations: {
        no_consumes_for_put_or_post: 'error'
      }
    };

    const spec = {
      paths: {
        '/CoolPath': {
          put: {
            produces: ['application/json'],
            summary: 'this is a summary',
            operationId: 'operationId'
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should not complain about a missing consumes when there is a global consumes', function() {
    const config = {
      operations: {
        no_consumes_for_put_or_post: 'error'
      }
    };

    const spec = {
      consumes: ['text/plain'],
      paths: {
        '/CoolPath': {
          put: {
            summary: 'this is a summary',
            operationId: 'operationId',
            produces: ['application/json'],
            parameters: [
              {
                name: 'NotABadParameter',
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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain about a get operation having consumes', function() {
    const config = {
      operations: {
        get_op_has_consumes: 'warning'
      }
    };

    const spec = {
      paths: {
        '/CoolPath': {
          get: {
            consumes: ['application/json'],
            produces: ['application/json'],
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                name: 'Parameter',
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

    const res = validate({ jsSpec: spec }, config);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual('paths./CoolPath.get.consumes');
    expect(res.warnings[0].message).toEqual(
      'GET operations should not specify a consumes field.'
    );
    expect(res.errors.length).toEqual(0);
  });

  it('should complain about a get operation not having produces', function() {
    const config = {
      operations: {
        no_produces: 'error'
      }
    };

    const spec = {
      paths: {
        '/CoolPath': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                name: 'Parameter',
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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual('paths./CoolPath.get.produces');
    expect(res.errors[0].message).toEqual(
      'Operations must have a non-empty `produces` field.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain about a post operation not having produces', function() {
    const config = {
      operations: {
        no_produces: 'error'
      }
    };

    const spec = {
      paths: {
        '/CoolPath': {
          post: {
            summary: 'this is a summary',
            operationId: 'operationId',
            consumes: ['application/json'],
            parameters: [
              {
                name: 'Parameter',
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
            ],
            responses: {
              '200': {
                description: 'successful response producing text/plain',
                schema: {
                  type: 'string'
                }
              },
              '204': {
                description: 'no content is a possibility here'
              },
              '500': {
                description: 'internal error'
              }
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual('paths./CoolPath.post.produces');
    expect(res.errors[0].message).toEqual(
      'Operations must have a non-empty `produces` field.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should not complain about a missing produces when there is a global produces', function() {
    const config = {
      operations: {
        no_produces: 'error'
      }
    };

    const spec = {
      produces: ['application/json'],
      paths: {
        '/CoolPath': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                name: 'Parameter',
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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should not complain about a missing produces for a HEAD operation', function() {
    const config = {
      operations: {
        no_produces: 'error'
      }
    };

    const spec = {
      produces: ['application/json'],
      paths: {
        '/CoolPath': {
          head: {
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                name: 'Parameter',
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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should not complain about a missing produces for an op where the only success response is a 204', function() {
    const config = {
      operations: {
        no_produces: 'error'
      }
    };

    const spec = {
      produces: ['application/json'],
      paths: {
        '/CoolPath': {
          post: {
            summary: 'this is a summary',
            operationId: 'operationId',
            consumes: ['application/json'],
            parameters: [
              {
                name: 'Parameter',
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
            ],
            responses: {
              '204': {
                description: 'no content'
              },
              '400': {
                description: 'bad request'
              },
              '500': {
                description: 'internal error'
              }
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });
});
