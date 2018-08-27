const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/oas3/semantic-validators/parameters');

describe('validation plugin - semantic - parameters - oas3', function() {
  it('should not complain when parameter is valid', function() {
    const config = {
      parameters: {
        no_in_property: 'error',
        invalid_in_property: 'error',
        missing_schema_or_content: 'error',
        has_schema_and_content: 'error'
      }
    };

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
    const config = {
      parameters: {
        no_in_property: 'error'
      }
    };

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
    const config = {
      parameters: {
        invalid_in_property: 'error'
      }
    };

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
      "'body' is not a supported value for `in`. Allowed values: query, header, path, cookie"
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain when the parameter has an undescribed data type', function() {
    const config = {
      parameters: {
        missing_schema_or_content: 'error'
      }
    };

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
    const config = {
      parameters: {
        has_schema_and_content: 'error'
      }
    };

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

  it('should not complain when parameter is a ref', function() {
    const config = {
      parameters: {
        no_in_property: 'error',
        invalid_in_property: 'error',
        missing_schema_or_content: 'error',
        has_schema_and_content: 'error'
      }
    };

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
});
