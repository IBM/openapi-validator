const inCodeValidator = require('../../../../src/lib');

describe('spectral - test validation that schema provided in content object', function() {
  it('should not error when the content object contains a schema', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          get: {
            responses: {
              '200': {
                $ref: '#/components/responses/GenericResponse'
              }
            }
          }
        }
      },
      components: {
        responses: {
          GenericResponse: {
            content: {
              'application/json': {
                // schema provided
                schema: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    };

    const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(0);
  });

  it('should error when a content object in a requestBody reference does not contain a schema', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          post: {
            requestBody: {
              $ref: '#/components/requestBodies/GenericRequestBody'
            }
          }
        }
      },
      components: {
        requestBodies: {
          GenericRequestBody: {
            content: {
              'application/json': {
                // schema not provided
              }
            }
          }
        }
      }
    };

    const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(1);
  });

  it('should error when a content object in a response reference does not contain a schema', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          post: {
            responses: {
              '200': {
                $ref: '#/components/responses/GenericResponse'
              }
            }
          }
        }
      },
      components: {
        responses: {
          GenericResponse: {
            content: {
              'application/json': {
                // schema not provided
              }
            }
          }
        }
      }
    };

    const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(1);
  });

  it('should error when the content object does not contain a schema in a response', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        'pets/{petId}': {
          get: {
            operationId: 'getPetsById',
            responses: {
              200: {
                content: {
                  '*/*': {
                    // schema not provided
                  }
                }
              },
              default: {
                content: {
                  'text/html': {
                    // schema not provided
                  }
                }
              }
            }
          }
        }
      }
    };

    const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(2);
  });

  it('should error when the content object does not contain a schema in a request body', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        createPet: {
          post: {
            operationId: 'addPet',
            requestBody: {
              content: {
                'application/json': {
                  // no schema provided
                }
              }
            }
          }
        }
      }
    };

    const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(1);
  });

  it('should error when the content object does not contain a schema in a parameter', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        createPet: {
          post: {
            operationId: 'addPet',
            parameters: [
              {
                name: 'exampleParam1',
                description: 'example param 1',
                in: 'query',
                content: {
                  'application/json': {
                    // no schema provided
                  }
                }
              },
              {
                name: 'exampleParam2',
                description: 'example param 2',
                in: 'query',
                content: {
                  'application/json': {
                    // no schema provided
                  }
                }
              }
            ]
          }
        }
      }
    };

    const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(2);
  });
});
