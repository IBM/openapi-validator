const inCodeValidator = require('../../../../src/lib');

describe('spectral - test error response content type is application/json', function() {
  it('should error only when the error response content type is not application/json', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          get: {
            responses: {
              '200': {
                content: {
                  // no error
                  'application/octet-stream': {
                    $ref: '#/components/schemas/GenericSchema'
                  }
                }
              },
              '400': {
                content: {
                  // error 1
                  'application/octet-stream': {
                    $ref: '#/components/schemas/GenericSchema'
                  }
                }
              },
              '404': {
                content: {
                  // no error
                  'application/json': {
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
      warn => warn.message === 'error response should support application/json'
    );
    expect(expectedWarnings.length).toBe(1);
  });
});
