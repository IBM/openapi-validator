const inCodeValidator = require('../../../../src/lib');

describe('spectral - test content type is not */*', function() {
  it('should error only when the content type is */*', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          post: {
            requestBody: {
              content: {
                // error 1
                '*/*': {
                  $ref: '#/components/schemas/GenericSchema'
                }
              }
            },
            parameters: [
              {
                name: 'param1',
                in: 'query',
                content: {
                  // error 2
                  '*/*': {
                    $ref: '#/components/schemas/GenericSchema'
                  }
                }
              }
            ],
            responses: {
              '200': {
                content: {
                  // error 3
                  '*/*': {
                    $ref: '#/components/schemas/GenericSchema'
                  }
                }
              },
              '201': {
                content: {
                  // no error
                  'application/json': {
                    $ref: '#/components/schemas/GenericSchema'
                  }
                }
              },
              '202': {
                content: {
                  // no error
                  'image/*': {
                    $ref: '#/components/schemas/GenericSchema'
                  }
                }
              }
            }
          }
        }
      },
      components: {
        schemas: {
          GenericSchema: {
            type: 'object',
            properties: {
              prop: {
                type: 'string'
              }
            }
          }
        }
      }
    };

    const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message ===
        '*/* should only be used when all content types are supported'
    );
    expect(expectedWarnings.length).toBe(3);
  });
});
