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
});
