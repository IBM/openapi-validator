const inCodeValidator = require('../../../../src/lib');

describe('spectral - test content entry validation does not produce false positives', function() {
  it('should not error when content object provided or for 101, 202, 204 response without content', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'ErrorAPI'
      },
      servers: [{ url: 'http://api.errorapi.com/v1' }],
      paths: {
        path1: {
          post: {
            requestBody: {
              content: {
                'application/json': {
                  $ref: '#/components/schemas/GenericSchema'
                }
              }
            },
            responses: {
              '200': {
                content: {
                  'application/json': {
                    $ref: '#/components/schemas/GenericSchema'
                  }
                }
              },
              '101': {
                description:
                  'Switching protocols response with no response body'
              },
              '202': {
                description: 'Success response with no response body'
              },
              '204': {
                description: 'Success response with no response body'
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
        'Request bodies and non-204 responses should define a content object'
    );
    expect(expectedWarnings.length).toBe(0);
  });
});

describe('spectral - test content entry validation does not produce false positives', function() {
  it('should error when content object not provided', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'ErrorAPI'
      },
      servers: [{ url: 'http://api.errorapi.com/v1' }],
      paths: {
        path1: {
          post: {
            requestBody: {},
            responses: {
              '200': {},
              '300': {},
              '400': {},
              '500': {}
            }
          }
        }
      }
    };

    const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message ===
        'Request bodies and non-204 responses should define a content object'
    );
    expect(expectedWarnings.length).toBe(5);
  });
});
