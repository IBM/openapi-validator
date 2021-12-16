const { responseErrorResponseSchema } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const name = 'response-error-response-schema';

describe('Spectral rule: response-error-response-schema', () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(
      name,
      responseErrorResponseSchema,
      rootDocument
    );

    expect(results).toHaveLength(0);
  });

  it('should not error if `errors` array items schema contains required properties', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {
            properties: {
              trace: {
                type: 'string',
                format: 'uuid',
                description: 'Error trace'
              },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'string'
                    },
                    message: {
                      type: 'string'
                    },
                    more_info: {
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

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(0);
  });

  it('should not error if `error` object contains required properties', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {
            properties: {
              trace: {
                type: 'string',
                format: 'uuid',
                description: 'Error trace'
              },
              error: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  },
                  more_info: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    };

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(0);
  });

  it('should error schema has no properties', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {}
        }
      }
    };

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Error response should be an object with properties'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'get',
      'responses',
      '400',
      'content',
      'application/json',
      'schema'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if response object has no `trace` field', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {
            properties: {
              code: {
                type: 'string'
              },
              message: {
                type: 'string'
              },
              more_info: {
                type: 'string'
              }
            }
          }
        }
      }
    };

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Error response should have a uuid `trace` field'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'get',
      'responses',
      '400',
      'content',
      'application/json',
      'schema',
      'properties'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if `status_code` field is not an integer', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {
            properties: {
              trace: {
                type: 'string',
                format: 'uuid',
                description: 'Error trace'
              },
              code: {
                type: 'string'
              },
              message: {
                type: 'string'
              },
              more_info: {
                type: 'string'
              },
              status_code: {
                type: 'string',
                description: 'this should be an integer'
              }
            }
          }
        }
      }
    };

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe('`status_code` field must be an integer');
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'get',
      'responses',
      '400',
      'content',
      'application/json',
      'schema',
      'properties',
      'status_code'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if `message` field is missing', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {
            properties: {
              trace: {
                type: 'string',
                format: 'uuid',
                description: 'Error trace'
              },
              code: {
                type: 'string'
              },
              more_info: {
                type: 'string'
              }
            }
          }
        }
      }
    };

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Error Model should contain a string, `message`, field'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'get',
      'responses',
      '400',
      'content',
      'application/json',
      'schema',
      'properties'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if `message` field is not a string', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {
            properties: {
              trace: {
                type: 'string',
                format: 'uuid',
                description: 'Error trace'
              },
              code: {
                type: 'string'
              },
              more_info: {
                type: 'string'
              },
              message: {
                type: 'integer'
              }
            }
          }
        }
      }
    };

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Error Model should contain a string, `message`, field'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'get',
      'responses',
      '400',
      'content',
      'application/json',
      'schema',
      'properties',
      'message'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if `code` field is missing', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {
            properties: {
              trace: {
                type: 'string',
                format: 'uuid',
                description: 'Error trace'
              },
              message: {
                type: 'string'
              },
              more_info: {
                type: 'string'
              }
            }
          }
        }
      }
    };

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Error Model should contain `code` field, a snake-case, string error code'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'get',
      'responses',
      '400',
      'content',
      'application/json',
      'schema',
      'properties'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if `code` field is not a string', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {
            properties: {
              trace: {
                type: 'string',
                format: 'uuid',
                description: 'Error trace'
              },
              message: {
                type: 'string'
              },
              more_info: {
                type: 'string'
              },
              code: {
                type: 'integer'
              }
            }
          }
        }
      }
    };

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Error Model should contain `code` field, a snake-case, string error code'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'get',
      'responses',
      '400',
      'content',
      'application/json',
      'schema',
      'properties',
      'code'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if `more_info` field is missing', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {
            properties: {
              trace: {
                type: 'string',
                format: 'uuid',
                description: 'Error trace'
              },
              code: {
                type: 'string'
              },
              message: {
                type: 'string'
              }
            }
          }
        }
      }
    };

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Error Model should contain `more_info` field that contains a URL with more info about the error'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'get',
      'responses',
      '400',
      'content',
      'application/json',
      'schema',
      'properties'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if `more_info` field is not a string', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {
            properties: {
              trace: {
                type: 'string',
                format: 'uuid',
                description: 'Error trace'
              },
              code: {
                type: 'string'
              },
              message: {
                type: 'string'
              },
              more_info: {
                type: 'integer'
              }
            }
          }
        }
      }
    };

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Error Model should contain `more_info` field that contains a URL with more info about the error'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'get',
      'responses',
      '400',
      'content',
      'application/json',
      'schema',
      'properties',
      'more_info'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if `errors` field is not an array', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {
            properties: {
              trace: {
                type: 'string',
                format: 'uuid',
                description: 'Error trace'
              },
              errors: {
                type: 'object',
                description: 'this should be an array'
              }
            }
          }
        }
      }
    };

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      '`errors` field should be an array of error models'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'get',
      'responses',
      '400',
      'content',
      'application/json',
      'schema',
      'properties',
      'errors'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if `errors` array items schema is not an object', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {
            properties: {
              trace: {
                type: 'string',
                format: 'uuid',
                description: 'Error trace'
              },
              errors: {
                type: 'array',
                items: {
                  type: 'string',
                  description: 'this should be an object'
                }
              }
            }
          }
        }
      }
    };

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Error Model should be an object with properties'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'get',
      'responses',
      '400',
      'content',
      'application/json',
      'schema',
      'properties',
      'errors',
      'items'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if `error` field is not an object', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].get.responses['400'] = {
      content: {
        'application/json': {
          schema: {
            properties: {
              trace: {
                type: 'string',
                format: 'uuid',
                description: 'Error trace'
              },
              error: {
                type: 'string',
                description: 'this should be an object'
              }
            }
          }
        }
      }
    };

    const results = await testRule(
      name,
      responseErrorResponseSchema,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Error Model should be an object with properties'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'get',
      'responses',
      '400',
      'content',
      'application/json',
      'schema',
      'properties',
      'error'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
