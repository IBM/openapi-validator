const inCodeValidator = require('../../../../src/lib');

describe('spectral - test error-response validation does not produce false positives', function() {
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

    res = await inCodeValidator(spec, true);
  });

  it('should not error when content object provided', function() {
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message ===
        'Request bodies and non-204 responses should define a content object'
    );
    expect(expectedWarnings.length).toBe(0);
  });

  it('should not error for error-response that is an object', function() {
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message === 'Error response should be an object with properties'
    );
    expect(expectedWarnings.length).toBe(0);
  });

  it('should not error for error-response that includes trace field', function() {
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === 'Error response should have a uuid `trace` field'
    );
    expect(expectedWarnings.length).toBe(0);
  });

  it('should not error for error-response with a valid status_code field', function() {
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === '`status_code` field must be an integer'
    );
    expect(expectedWarnings.length).toBe(0);
  });

  it('should not error for error-response `errors` field that is an array', function() {
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message === '`errors` field should be an array of error models'
    );
    expect(expectedWarnings.length).toBe(0);
  });

  it('should not error for error-response that with `errors` field that has object items', function() {
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === 'Error Model should be an object with properties'
    );
    expect(expectedWarnings.length).toBe(0);
  });

  it('should not error for error model with valid code field', function() {
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message ===
        'Error Model should contain `code` field, a snake-case, string, enum error code'
    );
    expect(expectedWarnings.length).toBe(0);
  });

  it('should not error for error model with valid message field', function() {
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message === 'Error Model should contain a string, `message`, field'
    );
    expect(expectedWarnings.length).toBe(0);
  });

  it('should not error for error model with valid `more_info` field', function() {
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message ===
        'Error Model should contain `more_info` field that contains a URL with more info about the error'
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
              '412': {
                $ref:
                  '#/components/responses/ErrorContainerModelItemsNotObjectsResponse'
              },
              '500': {
                $ref: '#/components/responses/MissingPropertiesErrorResponse'
              },
              '501': {
                $ref: '#/components/responses/IncorrectPropertiesErrorResponse'
              },
              '502': {
                $ref:
                  '#/components/responses/ErrorContainerModelIncorrectItemsPropertiesResponse'
              },
              '503': {
                $ref:
                  '#/components/responses/SingleErrorModelIncorrectPropertiesResponse'
              },
              '504': {
                $ref: '#/components/responses/SingleErrorModelNotObjectResponse'
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
          },
          ErrorContainerModelItemsNotObjectsResponse: {
            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/ErrorContainerModelItemsNotObjects'
                }
              }
            }
          },
          ErrorContainerModelIncorrectItemsPropertiesResponse: {
            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/ErrorContainerModelIncorrectItemsProperties'
                }
              }
            }
          },
          SingleErrorModelIncorrectPropertiesResponse: {
            content: {
              'application/json': {
                schema: {
                  $ref:
                    '#/components/schemas/SingleErrorModelIncorrectProperties'
                }
              }
            }
          },
          SingleErrorModelNotObjectResponse: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SingleErrorModelNotObject'
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
              errors: {},
              trace: {
                // should be string, uuid
                type: 'integer'
              },
              status_code: {
                type: 'string'
              }
            }
          },
          ErrorContainerModelItemsNotObjects: {
            type: 'object',
            properties: {
              errors: {
                type: 'array',
                items: {}
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
          ErrorContainerModelIncorrectItemsProperties: {
            type: 'object',
            properties: {
              errors: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/IncorrectPropertiesSchema'
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
          SingleErrorModelNotObject: {
            type: 'object',
            properties: {
              error: {
                type: 'string'
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
          SingleErrorModelIncorrectProperties: {
            type: 'object',
            properties: {
              error: {
                $ref: '#/components/schemas/IncorrectPropertiesSchema'
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
          IncorrectPropertiesSchema: {
            type: 'object',
            properties: {
              code: {
                // should be string
                type: 'integer'
              },
              message: {
                type: 'integer'
              },
              more_info: {
                type: 'integer'
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
      warn =>
        warn.message ===
        'Request bodies and non-204 responses should define a content object'
    );
    expect(expectedWarnings.length).toBe(1);
  });

  it('should error for error-response that is not an object', function() {
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message === 'Error response should be an object with properties'
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

  it('should error for error-response `errors` field that is not an array', function() {
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message === '`errors` field should be an array of error models'
    );
    expect(expectedWarnings.length).toBe(1);
  });

  it('should error for error-response that with `errors` field that does not have object items', function() {
    const expectedWarnings = res.warnings.filter(
      warn => warn.message === 'Error Model should be an object with properties'
    );
    expect(expectedWarnings.length).toBe(2);
  });

  it('should error for error model with missing or invalid code field', function() {
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message ===
        'Error Model should contain `code` field, a snake-case, string error code'
    );
    expect(expectedWarnings.length).toBe(3);
  });

  it('should error for error model with missing or invalid message field', function() {
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message === 'Error Model should contain a string, `message`, field'
    );
    expect(expectedWarnings.length).toBe(3);
  });

  it('should error for error model with missing or invalid `more_info` field', function() {
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message ===
        'Error Model should contain `more_info` field that contains a URL with more info about the error'
    );
    expect(expectedWarnings.length).toBe(3);
  });
});
