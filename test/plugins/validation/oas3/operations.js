const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/oas3/semantic-validators/operations');
const config = require('../../../../src/.defaultsForValidator').defaults.oas3;

describe('validation plugin - semantic - operations - oas3', function() {
  it('should complain about a request body not having a content field', function() {
    const spec = {
      paths: {
        '/pets': {
          post: {
            summary: 'this is a summary',
            operationId: 'operationId',
            requestBody: {
              description: 'body for request'
            }
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual('paths./pets.post.requestBody');
    expect(res.errors[0].message).toEqual(
      'Request bodies MUST specify a `content` property'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should warn about an operation with a non-form request body that does not set a name', function() {
    const spec = {
      paths: {
        '/pets': {
          post: {
            summary: 'this is a summary',
            operationId: 'operationId',
            requestBody: {
              description: 'body for request',
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
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual('paths./pets.post');
    expect(res.warnings[0].message).toEqual(
      'Operations with non-form request bodies should set a name with the x-codegen-request-body-name annotation.'
    );
    expect(res.errors.length).toEqual(0);
  });

  it('should not warn about an operation with a non-form request body that sets a name', function() {
    const spec = {
      paths: {
        '/pets': {
          post: {
            'x-codegen-request-body-name': 'goodRequestBody',
            summary: 'this is a summary',
            operationId: 'operationId',
            requestBody: {
              description: 'body for request',
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
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors.length).toEqual(0);
  });

  // should not warn about a form request body
  it('should not warn about an operation with a form request body that does not set a name', function() {
    const spec = {
      paths: {
        '/pets': {
          post: {
            summary: 'this is a summary',
            operationId: 'operationId',
            requestBody: {
              description: 'body for request',
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    properties: {
                      name: {
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

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors.length).toEqual(0);
  });
});
