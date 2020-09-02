const expect = require('expect');
const resolver = require('json-schema-ref-parser');

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

  it('should complain when a response is missing a description', function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            responses: {
              '200': {
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
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'responses',
      '200'
    ]);
    expect(res.errors[0].message).toEqual(
      'All responses must include a description.'
    );
  });

  it('should complain when 422 response code used', function() {
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
              },
              '422': {
                description: '422 response discouraged'
              }
            }
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].message).toEqual(
      'Should use status code 400 instead of 422 for invalid request payloads.'
    );
  });

  it('should complain when 302 response code used', function() {
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
              },
              '302': {
                description: '302 response discouraged'
              }
            }
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].message).toEqual(
      'Should use status codes 303 or 307 instead of 302.'
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

  it('should complain when response object only has a default', function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            responses: {
              default: {
                description: 'the default response'
              }
            }
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(['paths', '/pets', 'get', 'responses']);
    expect(res.errors[0].message).toEqual(
      'Each `responses` object MUST have at least one response code.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain when no response codes are valid', function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            responses: {
              '2007': {
                description: 'an invalid response'
              }
            }
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(['paths', '/pets', 'get', 'responses']);
    expect(res.errors[0].message).toEqual(
      'Each `responses` object MUST have at least one response code.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should not complain when there are no problems', function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            responses: {
              '204': {
                description: 'successful operation call with no response body'
              }
            }
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain when a non-204 success does not have response body', function() {
    const spec = {
      paths: {
        '/example': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            responses: {
              '200': {
                description: 'successful operation call with no response body'
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
      '/example',
      'get',
      'responses',
      '200'
    ]);
    expect(res.warnings[0].message).toEqual(
      `A 200 response should include a response body. Use 204 for responses without content.`
    );
  });

  it('should issue multiple warnings when multiple non-204 successes do not have response bodies', function() {
    const spec = {
      paths: {
        '/example1': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId_1',
            responses: {
              '200': {
                description: 'first successful response with no response body'
              },
              '202': {
                description: 'second successful response with no response body'
              }
            }
          }
        },
        '/example2': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId_2',
            responses: {
              '203': {
                description: 'third successful response with no response body'
              }
            }
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.warnings.length).toEqual(3);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/example1',
      'get',
      'responses',
      '200'
    ]);
    expect(res.warnings[0].message).toEqual(
      `A 200 response should include a response body. Use 204 for responses without content.`
    );
    expect(res.warnings[1].path).toEqual([
      'paths',
      '/example1',
      'get',
      'responses',
      '202'
    ]);
    expect(res.warnings[1].message).toEqual(
      `A 202 response should include a response body. Use 204 for responses without content.`
    );
    expect(res.warnings[2].path).toEqual([
      'paths',
      '/example2',
      'get',
      'responses',
      '203'
    ]);
    expect(res.warnings[2].message).toEqual(
      `A 203 response should include a response body. Use 204 for responses without content.`
    );
  });

  it('should not complain when a non-204 success has a ref to a response with content', async function() {
    const jsSpec = {
      paths: {
        '/comments': {
          post: {
            operationId: 'add_comment',
            summary: 'adds a comment',
            responses: {
              '201': {
                $ref: '#/components/responses/success'
              }
            }
          }
        }
      },
      components: {
        responses: {
          success: {
            description: 'successful post',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    };

    const spec = await resolver.dereference(jsSpec);

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain about having only error responses', function() {
    const spec = {
      paths: {
        '/pets': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            responses: {
              '400': {
                description: 'bad request'
              },
              '401': {
                description: 'unauthorized'
              },
              '404': {
                description: 'resource not found'
              },
              default: {
                description: 'any other response'
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
      'responses'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Each `responses` object SHOULD have at least one code for a successful response.'
    );
    expect(res.errors.length).toEqual(0);
  });

  it('should complain about 204 response that defines a response body', function() {
    const spec = {
      paths: {
        '/pets': {
          delete: {
            summary: 'this is a summary',
            operationId: 'operationId',
            responses: {
              '204': {
                description: 'bad request',
                content: {
                  schema: {
                    type: 'string'
                  }
                }
              },
              '400': {
                description: 'bad request'
              },
              default: {
                description: 'any other response'
              }
            }
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'paths',
      '/pets',
      'delete',
      'responses',
      '204',
      'content'
    ]);
    expect(res.errors[0].message).toEqual(
      'A 204 response MUST NOT include a message-body.'
    );
  });
});
