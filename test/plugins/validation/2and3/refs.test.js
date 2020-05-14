const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/refs');

describe('validation plugin - semantic - refs', function() {
  describe('Definitions should be referenced at least once in the document', function() {
    it('should warn about an unused definition - Swagger 2', function() {
      const jsSpec = {
        paths: {
          '/CoolPath/{id}': {
            parameters: [
              {
                name: 'id',
                in: 'path',
                description: 'An id'
              }
            ]
          }
        },
        definitions: {
          SchemaObject: {
            type: 'object',
            required: ['id'],
            properties: {
              id: {
                type: 'string'
              }
            }
          }
        }
      };

      const specStr = JSON.stringify(jsSpec, null, 2);
      const isOAS3 = false;

      const res = validate({ jsSpec, specStr, isOAS3 });
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].path).toEqual('definitions.SchemaObject');
      expect(res.warnings[0].message).toEqual(
        'Definition was declared but never used in document'
      );
    });

    it('should warn about an unused schema definition - OpenAPI 3', function() {
      const jsSpec = {
        paths: {
          '/CoolPath/{id}': {
            parameters: [
              {
                name: 'id',
                in: 'path',
                description: 'An id'
              }
            ]
          }
        },
        components: {
          schemas: {
            SchemaObject: {
              type: 'object',
              required: ['id'],
              properties: {
                id: {
                  type: 'string'
                }
              }
            }
          }
        }
      };

      const specStr = JSON.stringify(jsSpec, null, 2);
      const isOAS3 = true;

      const res = validate({ jsSpec, specStr, isOAS3 });
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].path).toEqual('components.schemas.SchemaObject');
      expect(res.warnings[0].message).toEqual(
        'Definition was declared but never used in document'
      );
    });

    it('should not warn about a used schema definition - OpenAPI 3', function() {
      const jsSpec = {
        paths: {
          '/CoolPath/{id}': {
            post: {
              requestBody: {
                description: 'post an object',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/SchemaObject'
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            SchemaObject: {
              type: 'object',
              required: ['id'],
              properties: {
                id: {
                  type: 'string'
                }
              }
            }
          }
        }
      };

      const specStr = JSON.stringify(jsSpec, null, 2);
      const isOAS3 = true;

      const res = validate({ jsSpec, specStr, isOAS3 });
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });
  });

  it('should warn about an unused parameter definition - OpenAPI 3', function() {
    const jsSpec = {
      paths: {
        '/CoolPath/{id}': {
          parameters: [
            {
              $ref: '#/components/parameters/one_parameter_definition'
            }
          ]
        }
      },
      components: {
        parameters: {
          one_parameter_definition: {
            name: 'id',
            in: 'path',
            description: 'An id'
          },
          other_parameter_definition: {
            name: 'other',
            in: 'query',
            description: 'another param'
          }
        }
      }
    };

    const specStr = JSON.stringify(jsSpec, null, 2);
    const isOAS3 = true;

    const res = validate({ jsSpec, specStr, isOAS3 });
    expect(res.warnings[0].path).toEqual(
      'components.parameters.other_parameter_definition'
    );
    expect(res.warnings[0].message).toEqual(
      'Definition was declared but never used in document'
    );
    expect(res.warnings.length).toEqual(1);
  });

  it('should not warn about used parameter definitions - OpenAPI 3', function() {
    const jsSpec = {
      paths: {
        '/CoolPath/{id}': {
          parameters: [
            {
              $ref: '#/components/parameters/one_parameter_definition'
            },
            {
              $ref: '#/components/parameters/other_parameter_definition'
            }
          ]
        }
      },
      components: {
        parameters: {
          one_parameter_definition: {
            name: 'id',
            in: 'path',
            description: 'An id'
          },
          other_parameter_definition: {
            name: 'other',
            in: 'query',
            description: 'another param'
          }
        }
      }
    };

    const specStr = JSON.stringify(jsSpec, null, 2);
    const isOAS3 = true;

    const res = validate({ jsSpec, specStr, isOAS3 });
    expect(res.warnings.length).toEqual(0);
  });

  it('should warn about an unused response definition - OpenAPI 3', function() {
    const jsSpec = {
      paths: {
        '/CoolPath/{id}': {
          responses: {
            '200': {
              description: '200 response',
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
      },
      components: {
        responses: {
          response400: {
            description: '400 response',
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
    };

    const specStr = JSON.stringify(jsSpec, null, 2);
    const isOAS3 = true;

    const res = validate({ jsSpec, specStr, isOAS3 });
    expect(res.warnings[0].path).toEqual('components.responses.response400');
    expect(res.warnings[0].message).toEqual(
      'Definition was declared but never used in document'
    );
    expect(res.warnings.length).toEqual(1);
  });

  it('should not warn about a used response definition - OpenAPI 3', function() {
    const jsSpec = {
      paths: {
        '/CoolPath/{id}': {
          responses: {
            '200': {
              description: '200 response',
              content: {
                'application/json': {
                  schema: {
                    type: 'string'
                  }
                }
              }
            },
            '400': {
              $ref: '#/components/responses/response400'
            }
          }
        }
      },
      components: {
        responses: {
          response400: {
            description: '400 response',
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
    };

    const specStr = JSON.stringify(jsSpec, null, 2);
    const isOAS3 = true;

    const res = validate({ jsSpec, specStr, isOAS3 });
    expect(res.warnings.length).toEqual(0);
  });
});
