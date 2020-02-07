const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/oas3/semantic-validators/responses');

describe('validation plugin - semantic - responses - oas3', function() {
  it('should complain when response object only has a default', function() {
    const config = {
      responses: {
        no_response_codes: 'error',
        no_success_response_codes: 'warning',
        no_response_body: 'warning'
      }
    };

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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(['paths', '/pets', 'get', 'responses']);
    expect(res.errors[0].message).toEqual(
      'Each `responses` object MUST have at least one response code.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain when no response codes are valid', function() {
    const config = {
      responses: {
        no_response_codes: 'error',
        no_success_response_codes: 'warning',
        no_response_body: 'warning'
      }
    };

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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(['paths', '/pets', 'get', 'responses']);
    expect(res.errors[0].message).toEqual(
      'Each `responses` object MUST have at least one response code.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should not complain when there are no problems', function() {
    const config = {
      responses: {
        no_response_codes: 'error',
        no_success_response_codes: 'warning',
        no_response_body: 'warning'
      }
    };

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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain when a non-204 success does not have response body', function() {
    const config = {
      responses: {
        no_response_codes: 'error',
        no_success_response_codes: 'warning',
        no_response_body: 'warning'
      }
    };

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

    const res = validate({ jsSpec: spec }, config);
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
    const config = {
      responses: {
        no_response_codes: 'error',
        no_success_response_codes: 'warning',
        no_response_body: 'warning'
      }
    };

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

    const res = validate({ jsSpec: spec }, config);
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

  it('should complain about having only error responses', function() {
    const config = {
      responses: {
        no_response_codes: 'error',
        no_success_response_codes: 'warning',
        no_response_body: 'warning'
      }
    };

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

    const res = validate({ jsSpec: spec }, config);
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
    const config = {
      responses: {
        no_response_codes: 'error',
        no_success_response_codes: 'warning',
        no_response_body: 'warning'
      }
    };

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

    const res = validate({ jsSpec: spec }, config);
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
