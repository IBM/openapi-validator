const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/walker');

const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - spec walker', () => {
  describe('Type key', () => {
    it('should return an error when "type" is a number', () => {
      const spec = {
        paths: {
          '/CoolPath/{id}': {
            responses: {
              '200': {
                schema: {
                  type: 4
                }
              }
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual([
        'paths',
        '/CoolPath/{id}',
        'responses',
        '200',
        'schema',
        'type'
      ]);
      expect(res.errors[0].message).toEqual('"type" should be a string');
      expect(res.warnings.length).toEqual(0);
    });

    it('should return an error when "type" is an array', () => {
      const spec = {
        paths: {
          '/CoolPath/{id}': {
            responses: {
              '200': {
                schema: {
                  type: ['number', 'string']
                }
              }
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual([
        'paths',
        '/CoolPath/{id}',
        'responses',
        '200',
        'schema',
        'type'
      ]);
      expect(res.errors[0].message).toEqual('"type" should be a string');
      expect(res.warnings.length).toEqual(0);
    });

    it('should not return an error when "type" is a property name', () => {
      const spec = {
        definitions: {
          ApiResponse: {
            type: 'object',
            properties: {
              code: {
                type: 'integer',
                format: 'int32'
              },
              type: {
                type: 'string'
              },
              message: {
                type: 'string'
              }
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });

    it('should not return an error when "type" is a model name', () => {
      const spec = {
        definitions: {
          type: {
            type: 'object',
            properties: {
              code: {
                type: 'integer',
                format: 'int32'
              },
              message: {
                type: 'string'
              }
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });
  });

  describe('Type key - OpenAPI 3', () => {
    it('should not return an error when "type" is a security scheme name', () => {
      const spec = {
        components: {
          securitySchemes: {
            type: {
              type: 'http',
              scheme: 'basic'
            }
          }
        }
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });
  });

  describe('$ref as property name', () => {
    it('should gracefully handle a property named $ref', function() {
      const spec = {
        definitions: {
          JSONSchemaProps: {
            description: 'A JSON-Schema following Specification Draft 4.',
            properties: {
              $ref: {
                type: 'string'
              },
              maximum: {
                type: 'integer',
                format: 'int64'
              },
              minimum: {
                type: 'integer',
                format: 'int64'
              }
            }
          }
        }
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });
  });

  describe('Minimums and maximums', () => {
    it('should return an error when minimum is more than maximum', () => {
      const spec = {
        definitions: {
          MyNumber: {
            minimum: '5',
            maximum: '2'
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual([
        'definitions',
        'MyNumber',
        'minimum'
      ]);
      expect(res.errors[0].message).toEqual(
        'Minimum cannot be more than maximum'
      );
      expect(res.warnings.length).toEqual(0);
    });

    it('should not return an error when minimum is less than maximum', () => {
      const spec = {
        definitions: {
          MyNumber: {
            minimum: '1',
            maximum: '2'
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });

    it('should return an error when minProperties is more than maxProperties', () => {
      const spec = {
        definitions: {
          MyNumber: {
            minProperties: '5',
            maxProperties: '2'
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual([
        'definitions',
        'MyNumber',
        'minProperties'
      ]);
      expect(res.errors[0].message).toEqual(
        'minProperties cannot be more than maxProperties'
      );
      expect(res.warnings.length).toEqual(0);
    });

    it('should not return an error when minProperties is less than maxProperties', () => {
      const spec = {
        definitions: {
          MyNumber: {
            minProperties: '1',
            maxProperties: '2'
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });

    it('should return an error when minLength is more than maxLength', () => {
      const spec = {
        definitions: {
          MyNumber: {
            minLength: '5',
            maxLength: '2'
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual([
        'definitions',
        'MyNumber',
        'minLength'
      ]);
      expect(res.errors[0].message).toEqual(
        'minLength cannot be more than maxLength'
      );
      expect(res.warnings.length).toEqual(0);
    });

    it('should not return an error when minLength is less than maxLength', () => {
      const spec = {
        definitions: {
          MyNumber: {
            minLength: '1',
            maxLength: '2'
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });
  });

  describe('Refs are restricted in specific areas of a spec', () => {
    describe('Response $refs', () => {
      it('should return a problem for a parameters $ref in a response position', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              responses: {
                '200': {
                  $ref: '#/parameters/abc'
                }
              }
            }
          }
        };

        const res = validate({ jsSpec: spec }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(1);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/CoolPath/{id}',
          'responses',
          '200',
          '$ref'
        ]);
        expect(res.warnings[0].message).toEqual(
          'responses $refs must follow this format: *#/responses*'
        );
      });

      it('should return a problem for a definitions $ref in a response position', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              schema: {
                $ref: '#/responses/abc'
              }
            }
          }
        };

        const res = validate({ jsSpec: spec }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(1);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/CoolPath/{id}',
          'schema',
          '$ref'
        ]);
        expect(res.warnings[0].message).toEqual(
          'schema $refs must follow this format: *#/definitions*'
        );
      });

      it('should not return a problem for a responses $ref in a response position', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              responses: {
                '200': {
                  $ref: '#/responses/abc'
                }
              }
            }
          }
        };

        const res = validate({ jsSpec: spec }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(0);
      });
    });

    describe('Schema $refs', () => {
      it('should return a problem for a parameters $ref in a schema position', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              schema: {
                $ref: '#/parameters/abc'
              }
            }
          }
        };

        const res = validate({ jsSpec: spec }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(1);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/CoolPath/{id}',
          'schema',
          '$ref'
        ]);
      });

      it('should return a problem for a responses $ref in a schema position', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              schema: {
                $ref: '#/responses/abc'
              }
            }
          }
        };

        const res = validate({ jsSpec: spec }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(1);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/CoolPath/{id}',
          'schema',
          '$ref'
        ]);
      });

      it('should not return a problem for a definition $ref in a schema position', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              schema: {
                $ref: '#/definitions/abc'
              }
            }
          }
        };

        const res = validate({ jsSpec: spec }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(0);
      });

      it("should not return a problem for a schema property named 'properties'", function() {
        // #492 regression
        const spec = {
          definitions: {
            ServicePlan: {
              description: 'New Plan to be added to a service.',
              properties: {
                plan_id: {
                  type: 'string',
                  description: 'ID of the new plan from the catalog.'
                },
                parameters: {
                  $ref: '#/definitions/Parameter'
                },
                previous_values: {
                  $ref: '#/definitions/PreviousValues'
                }
              }
            }
          }
        };

        const res = validate({ jsSpec: spec }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(0);
      });
    });

    describe('Parameter $refs', () => {
      it('should return a problem for a definition $ref in a parameter position', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              parameters: [
                {
                  $ref: '#/definitions/abc'
                }
              ]
            }
          }
        };

        const res = validate({ jsSpec: spec }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(1);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/CoolPath/{id}',
          'parameters',
          '0',
          '$ref'
        ]);
        expect(res.warnings[0].message).toEqual(
          'parameters $refs must follow this format: *#/parameters*'
        );
      });

      it('should return a problem for a responses $ref in a parameter position', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              parameters: [
                {
                  $ref: '#/responses/abc'
                }
              ]
            }
          }
        };

        const res = validate({ jsSpec: spec }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(1);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/CoolPath/{id}',
          'parameters',
          '0',
          '$ref'
        ]);
      });

      it('should not return a problem for a parameter $ref in a parameter position', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              parameters: [
                {
                  $ref: '#/parameters/abc'
                }
              ]
            }
          }
        };

        const res = validate({ jsSpec: spec }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(0);
      });
    });

    describe('Restricted $refs - OpenAPI 3', () => {
      it('should return a problem for a schema not defined in schemas', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              post: {
                requestBody: {
                  description: 'post an object',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/requestBodies/Object'
                      }
                    }
                  }
                }
              }
            }
          }
        };

        const res = validate({ jsSpec: spec, isOAS3: true }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(1);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/CoolPath/{id}',
          'post',
          'requestBody',
          'content',
          'application/json',
          'schema',
          '$ref'
        ]);
        expect(res.warnings[0].message).toEqual(
          'schema $refs must follow this format: *#/components/schemas*'
        );
      });

      it('should not return a problem for a header ref within a responses object', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              get: {
                responses: {
                  description: 'get a string',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'string'
                      }
                    }
                  },
                  headers: {
                    'X-Fake-Header': {
                      $ref: '#/components/headers/FakeHeader'
                    }
                  }
                }
              }
            }
          }
        };

        const res = validate({ jsSpec: spec, isOAS3: true }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(0);
      });
    });

    describe('Ref siblings', () => {
      it('should not return a warning when another property is a sibling of a $ref', () => {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              schema: {
                $ref: '#/definitions/abc',
                description: 'My very cool schema'
              }
            }
          }
        };

        const res = validate({ jsSpec: spec }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(0);
      });

      it('should return a warning for a $ref sibling if configured to', () => {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              schema: {
                $ref: '#/definitions/abc',
                description: 'My very cool schema'
              }
            }
          }
        };

        // temporarily configure $ref_siblings to be a warning
        const originalValue = config.walker.$ref_siblings;
        config.walker.$ref_siblings = 'warning';

        const res = validate({ jsSpec: spec }, config);

        // revert changes to config to avoid affecting other tests
        config.walker.$ref_siblings = originalValue;

        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(1);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/CoolPath/{id}',
          'schema',
          'description'
        ]);
      });

      it('should return a problem for a links $ref that does not have the correct format', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              responses: {
                '200': {
                  desciption: 'hi',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'string'
                      }
                    }
                  },
                  headers: {
                    Location: {
                      description: 'hi',
                      schema: {
                        type: 'string'
                      }
                    }
                  },
                  links: {
                    link1: {
                      $ref: '#/parameters/abc'
                    }
                  }
                }
              }
            }
          }
        };

        const res = validate({ jsSpec: spec, isOAS3: true }, config);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(1);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/CoolPath/{id}',
          'responses',
          '200',
          'links',
          'link1',
          '$ref'
        ]);
        expect(res.warnings[0].message).toEqual(
          'links $refs must follow this format: *#/components/links*'
        );
      });
    });
  });
});
