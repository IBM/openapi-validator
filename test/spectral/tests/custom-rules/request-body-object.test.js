const inCodeValidator = require('../../../../src/lib');

describe('spectral - test that request body schema is an object', function() {
  it('should error only when request body is not an object', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        '/path1': {
          post: {
            operationId: 'addPet',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    // no error
                    type: 'object',
                    properties: {
                      prop1: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          },
          put: {
            operationId: 'updatePet',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    // error 1
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },
          patch: {
            operationId: 'patchPet',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    // no error, properties provided
                    properties: {
                      prop1: {
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

    const res = await inCodeValidator(spec, true);
    const expectedErrors = res.errors.filter(
      err =>
        err.message === 'All request bodies MUST be structured as an object'
    );
    expect(expectedErrors.length).toBe(1);
    expect(expectedErrors[0].path).toEqual([
      'paths',
      '/path1',
      'put',
      'requestBody',
      'content',
      'application/json',
      'schema',
      'type'
    ]);
  });
});
