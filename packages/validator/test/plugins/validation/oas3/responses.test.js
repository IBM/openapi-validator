const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/oas3/semantic-validators/responses');
const config = require('../../../../src/.defaultsForValidator').defaults.oas3;

describe('validation plugin - semantic - responses - oas3', function() {
  it('should not complain for valid use of type:string, format: binary', function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            responses: {
              '200': {
                description: '200 response',
                content: {
                  'multipart/form-data': {
                    schema: {
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
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain when response body uses json and schema type: string, format: binary', function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            responses: {
              '200': {
                description: '200 response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
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
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'responses',
      '200',
      'content',
      'application/json',
      'schema',
      'items'
    ]);
    expect(res.warnings[0].message).toEqual(
      'JSON request/response bodies should not contain binary (type: string, format: binary) values.'
    );
  });

  it('should complain when default response body uses json as second mime type and uses schema type: string, format: binary', function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            responses: {
              default: {
                description: 'the default response',
                content: {
                  'text/plain': {
                    schema: {
                      type: 'string'
                    }
                  },
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        prop1: {
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
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'responses',
      'default',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1'
    ]);
    expect(res.warnings[0].message).toEqual(
      'JSON request/response bodies should not contain binary (type: string, format: binary) values.'
    );
  });

  it('should complain multiple times when multiple json response bodies use type: string, format: binary', function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            responses: {
              '200': {
                description: '200 response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        type: 'string',
                        format: 'binary'
                      }
                    }
                  }
                }
              },
              '201': {
                description: '201 response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        prop1: {
                          type: 'string',
                          format: 'binary'
                        },
                        prop2: {
                          type: 'array',
                          items: {
                            type: 'string',
                            format: 'binary'
                          }
                        }
                      }
                    }
                  }
                }
              },
              '204': {
                description: '204 response'
              },
              default: {
                description: 'the default response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        prop1: {
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
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.warnings.length).toEqual(4);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'responses',
      '200',
      'content',
      'application/json',
      'schema',
      'items'
    ]);
    expect(res.warnings[0].message).toEqual(
      'JSON request/response bodies should not contain binary (type: string, format: binary) values.'
    );
    expect(res.warnings[1].path).toEqual([
      'paths',
      '/pets',
      'get',
      'responses',
      '201',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1'
    ]);
    expect(res.warnings[1].message).toEqual(
      'JSON request/response bodies should not contain binary (type: string, format: binary) values.'
    );
    expect(res.warnings[2].path).toEqual([
      'paths',
      '/pets',
      'get',
      'responses',
      '201',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop2',
      'items'
    ]);
    expect(res.warnings[2].message).toEqual(
      'JSON request/response bodies should not contain binary (type: string, format: binary) values.'
    );
    expect(res.warnings[3].path).toEqual([
      'paths',
      '/pets',
      'get',
      'responses',
      'default',
      'content',
      'application/json',
      'schema',
      'properties',
      'prop1'
    ]);
    expect(res.warnings[3].message).toEqual(
      'JSON request/response bodies should not contain binary (type: string, format: binary) values.'
    );
  });
});
