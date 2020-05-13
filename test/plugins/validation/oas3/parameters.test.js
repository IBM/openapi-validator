const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/oas3/semantic-validators/parameters');
const config = require('../../../../src/.defaultsForValidator').defaults.oas3;

describe('validation plugin - semantic - parameters - oas3', function() {
  it('should not complain when parameter is valid', function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                in: 'query',
                name: 'query_param',
                schema: {
                  type: 'string'
                },
                description: 'a parameter'
              }
            ],
            responses: {
              '200': {
                description: 'success',
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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain when `in` is missing', function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                name: 'query_param',
                schema: {
                  type: 'string'
                },
                description: 'a parameter'
              }
            ],
            responses: {
              '200': {
                description: 'success',
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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'parameters',
      '0'
    ]);
    expect(res.errors[0].message).toEqual(
      'Parameters MUST have an `in` property.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain when `in` is an invalid value', function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                in: 'body',
                name: 'query_param',
                schema: {
                  type: 'string'
                },
                description: 'a parameter'
              }
            ],
            responses: {
              '200': {
                description: 'success',
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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'parameters',
      '0',
      'in'
    ]);
    expect(res.errors[0].message).toEqual(
      "Unsupported value for `in`: 'body'. Allowed values are query, header, path, cookie"
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain when the parameter has an undescribed data type', function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                in: 'cookie',
                name: 'query_param',
                description: 'a parameter'
              }
            ],
            responses: {
              '200': {
                description: 'success',
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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'parameters',
      '0'
    ]);
    expect(res.errors[0].message).toEqual(
      'Parameters MUST have their data described by either `schema` or `content`.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain when a parameter describes data type with both `schema` and `content`', function() {
    const spec = {
      components: {
        parameters: {
          BadParam: {
            in: 'path',
            name: 'path_param',
            description: 'a parameter',
            content: {
              'text/plain': {
                schema: {
                  type: 'string'
                }
              }
            },
            schema: {
              type: 'string'
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'components',
      'parameters',
      'BadParam'
    ]);
    expect(res.errors[0].message).toEqual(
      'Parameters MUST NOT have both a `schema` and `content` property.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain when a parameter uses json content with schema type: string, format: binary', function() {
    const spec = {
      components: {
        parameters: {
          BadParam: {
            in: 'path',
            name: 'path_param',
            description: 'a parameter',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    prop1: {
                      type: 'array',
                      items: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            sub_prop1: {
                              type: 'object',
                              properties: {
                                sub_sub_prop1: {
                                  type: 'string',
                                  format: 'binary'
                                }
                              }
                            }
                          }
                        }
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

    const res = validate({ jsSpec: spec }, config);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'components',
      'parameters',
      'BadParam',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1',
      'items',
      'items',
      'properties',
      'sub_prop1',
      'properties',
      'sub_sub_prop1'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Parameters should not contain binary (type: string, format: binary) values.'
    );
  });

  it('should complain when a parameter uses json as second mime type with schema type: string, format: binary', function() {
    const spec = {
      components: {
        parameters: {
          BadParam: {
            in: 'path',
            name: 'path_param',
            description: 'a parameter',
            content: {
              'text/plain': {
                type: 'string'
              },
              'application/json': {
                schema: {
                  type: 'string',
                  format: 'binary'
                }
              }
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'components',
      'parameters',
      'BadParam',
      'content',
      'application/json',
      'schema'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Parameters should not contain binary (type: string, format: binary) values.'
    );
  });

  it('should complain multiple times when multiple parameters use schema type: string, format: binary', function() {
    const spec = {
      components: {
        parameters: {
          BadParam1: {
            schema: {
              type: 'string',
              format: 'binary'
            }
          },
          BadParam2: {
            schema: {
              type: 'string',
              format: 'binary'
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.warnings.length).toEqual(2);
    expect(res.warnings[0].path).toEqual([
      'components',
      'parameters',
      'BadParam1',
      'schema'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Parameters should not contain binary (type: string, format: binary) values.'
    );
  });

  it('should not complain when the schema field is empty', function() {
    const spec = {
      components: {
        parameters: {
          GoodParam: {}
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.warnings.length).toEqual(0);
  });

  it('should not complain when parameter is a ref', async function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                $ref: '#/components/parameters/QueryParam'
              }
            ],
            responses: {
              '200': {
                description: 'success',
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
      },
      components: {
        parameters: {
          QueryParam: {
            in: 'query',
            name: 'query_param',
            schema: {
              type: 'string'
            },
            description: 'a parameter'
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should not complain twice when parameter is a ref', async function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                $ref: '#/components/parameters/QueryParam'
              }
            ],
            responses: {
              '200': {
                description: 'success',
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
      },
      components: {
        parameters: {
          QueryParam: {
            in: 'query',
            name: 'query_param',
            schema: {
              type: 'string',
              format: 'binary'
            },
            description: 'a parameter'
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.warnings.length).toEqual(1);
  });

  it('should not complain about a schema property named `parameters`', function() {
    const spec = {
      components: {
        schemas: {
          SomeModel: {
            properties: {
              parameters: {
                type: 'object',
                description: 'A map of key/value pairs',
                additionalProperties: {
                  description: 'A parameter. But not an OpenAPI parameter ;)'
                }
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
