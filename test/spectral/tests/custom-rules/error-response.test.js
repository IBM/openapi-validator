const inCodeValidator = require('../../../../src/lib');

describe('spectral - test error-response validation does not produce false positives', function() {
  it('should not error for missing content for success response with no content or failure response with content', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'ErrorAPI'
      },
      servers: [{ url: 'http://api.errorapi.com/v1' }],
      paths: {
        path1: {
          get: {
            responses: {
              '204': {
                description: 'Success response with no response body'
              },
              '400': {
                $ref: '#/components/responses/ErrorResponse'
              },
              '404': {
                $ref: '#/components/responses/AcceptableErrorResponse'
              },
              '500': {
                $ref: '#/components/responses/ErrorResponse'
              }
            }
          }
        }
      },
      components: {
        responses: {
          AcceptableErrorResponse: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AcceptableErrorModel'
                }
              }
            }
          },
          ErrorResponse: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorContainerModel'
                }
              }
            }
          }
        },
        schemas: {
          AcceptableErrorModel: {
            type: 'object',
            properties: {
              error: {
                $ref: '#/components/schemas/ErrorModel'
              },
              trace: {
                type: 'string',
                format: 'uuid'
              }
            }
          },
          ErrorContainerModel: {
            type: 'object',
            properties: {
              errors: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/ErrorModel'
                }
              },
              trace: {
                type: 'string',
                format: 'uuid'
              },
              status_code: {
                type: 'integer'
              }
            }
          },
          ErrorModel: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                enum: ['error_1', 'error_2']
              },
              message: {
                type: 'string'
              },
              more_info: {
                type: 'string',
                description: 'url with link to more information about the error'
              },
              target: {
                $ref: '#/components/schemas/ErrorTargetModel'
              }
            }
          },
          ErrorTargetModel: {
            type: {
              type: 'string',
              enum: ['field', 'parameter', 'header']
            },
            name: {
              type: 'string',
              description: 'name of the problematic field that caused the error'
            }
          }
        }
      }
    };

    const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === 'Error response should have a content field'
    );
    expect(expectedWarnings.length).toBe(0);
  });
});

describe('spectral - test error-response validation catches invalid error responses', function() {
  let res;

  beforeAll(async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'ErrorAPI'
      },
      servers: [{ url: 'http://api.errorapi.com/v1' }],
      paths: {
        path1: {
          get: {
            responses: {
              '204': {
                description: 'Success response with no response body'
              },
              '400': {
                $ref: '#/components/responses/NoObjectErrorModelResponse'
              },
              '404': {
                $ref: '#/components/responses/NoContentErrorResponse'
              },
              '500': {
                $ref: '#/components/responses/MissingPropertiesErrorResponse'
              },
              '501': {
                $ref: '#/components/responses/IncorrectPropertiesErrorResponse'
              }
            }
          }
        }
      },
      components: {
        responses: {
          NoObjectErrorModelResponse: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BadErrorModel'
                }
              }
            }
          },
          NoContentErrorResponse: {
            schema: {
              $ref: '#/components/schemas/BadErrorModel'
            }
          },
          MissingPropertiesErrorResponse: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MissingPropertiesErrorModel'
                }
              }
            }
          },
          IncorrectPropertiesErrorResponse: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/IncorrectPropertiesModel'
                }
              }
            }
          }
        },
        schemas: {
          BadErrorModel: {
            type: 'string'
          },
          MissingPropertiesErrorModel: {
            type: 'object',
            properties: {}
          },
          IncorrectPropertiesModel: {
            type: 'object',
            properties: {
              trace: {
                type: 'string'
                // missing format, uuid
              },
              status_code: {
                type: 'string'
              }
            }
          }
        }
      }
    };

    res = await inCodeValidator(spec, true);
  });

  it('should error for missing content for failure response with no content', function() {
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === 'Error response should have a content field'
    );
    expect(expectedWarnings.length).toBe(1);
  });

  it('should error for error-response that is not an object', function() {
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === 'Error response should be an object'
    );
    expect(expectedWarnings.length).toBe(1);
  });

  it('should error for error-response that does not include trace field', function() {
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === 'Error response should have a uuid `trace` field'
    );
    expect(expectedWarnings.length).toBe(2);
  });

  it('should error for error-response that with an invalid status_code field', function() {
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === '`status_code` field must be an integer'
    );
    expect(expectedWarnings.length).toBe(1);
  });
});
