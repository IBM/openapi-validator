const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/parameters-ibm');

const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - parameters-ibm', () => {
  describe('Swagger 2', () => {
    it('should return an error when a parameter does not have a description', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'name',
                  in: 'query',
                  type: 'string'
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual([
        'paths',
        '/pets',
        'get',
        'parameters',
        '0'
      ]);
      expect(res.errors[0].message).toEqual(
        'Parameter objects must have a `description` field.'
      );
    });

    it('should return an error when snake case is not used', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'camelCase',
                  in: 'query',
                  description: 'description',
                  type: 'string'
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors[0].path).toEqual([
        'paths',
        '/pets',
        'get',
        'parameters',
        '0'
      ]);
      expect(res.errors[0].message).toEqual(
        'Parameter names must follow case convention: lower_snake_case'
      );
    });

    it('should not return a snake case error when "in" is set to "header" ', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'camelCase',
                  in: 'header',
                  description: 'description',
                  type: 'string'
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });

    it('should not return a case_convention error when parameter is deprecated', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'camelCase',
                  in: 'query',
                  description: 'description',
                  type: 'string',
                  deprecated: true
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });

    it('should not validate within extensions', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              'x-sdk-extension': {
                parameters: {
                  example: [
                    {
                      name: 'notAGoodName',
                      description: '     ',
                      in: 'query',
                      type: 'number',
                      format: 'int32'
                    }
                  ]
                }
              }
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });

    it('should return an error when a parameter defines a content or accept type ', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'name',
                  in: 'query',
                  type: 'string',
                  description: 'good description'
                },
                {
                  name: 'Accept',
                  in: 'header',
                  description:
                    'bad parameter because it specifies an accept type',
                  required: false,
                  type: 'string',
                  enum: ['application/json', 'application/octet-stream']
                },
                {
                  name: 'content-Type',
                  in: 'header',
                  required: false,
                  type: 'string',
                  description: 'another bad parameter'
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(2);
      expect(res.errors[0].path).toEqual([
        'paths',
        '/pets',
        'get',
        'parameters',
        '1'
      ]);
      expect(res.errors[0].message).toEqual(
        'Parameters must not explicitly define `Accept`. Rely on the `produces` field to specify accept-type.'
      );
      expect(res.errors[1].path).toEqual([
        'paths',
        '/pets',
        'get',
        'parameters',
        '2'
      ]);
      expect(res.errors[1].message).toEqual(
        'Parameters must not explicitly define `Content-Type`. Rely on the `consumes` field to specify content-type.'
      );
    });

    it('should flag a required parameter that specifies a default value', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'tags',
                  in: 'query',
                  required: true,
                  description: 'tags to filter by',
                  type: 'string',
                  default: 'reptile'
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].path).toEqual([
        'paths',
        '/pets',
        'get',
        'parameters',
        '0'
      ]);
      expect(res.warnings[0].message).toEqual(
        'Required parameters should not specify default values.'
      );
      expect(res.errors.length).toEqual(0);
    });

    it('should not flag an optional parameter that specifies a default value', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'tags',
                  in: 'query',
                  required: false,
                  description: 'tags to filter by',
                  type: 'string',
                  default: 'reptile'
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(0);
    });

    it('should not return an error for formData parameters of type file', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'file',
                  in: 'formData',
                  type: 'file',
                  required: true,
                  description: 'A file passed in formData'
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec, isOAS3: false }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });

    it('should return an error for bad parameters that live in the top level', () => {
      const spec = {
        parameters: [
          {
            name: 'someparam',
            in: 'header',
            type: 'string',
            required: true
          }
        ]
      };

      const res = validate({ jsSpec: spec, isOAS3: false }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].message).toEqual(
        'Parameter objects must have a `description` field.'
      );
      expect(res.warnings.length).toEqual(0);
    });
  });

  describe('OpenAPI 3', () => {
    it('should not complain about a property named parameters that is not a parameter object', () => {
      const spec = {
        components: {
          responses: {
            parameters: {
              description: 'successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      parameters: {
                        type: 'string',
                        description: 'this is a description',
                        additionalProperties: {}
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(0);
    });

    it('should return an error when a parameter defines content-type, accept, or authorization', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'name',
                  in: 'query',
                  schema: {
                    type: 'string'
                  },
                  description: 'good description'
                },
                {
                  name: 'ACCEPT',
                  in: 'header',
                  description:
                    'bad parameter because it specifies an accept type',
                  required: false,
                  schema: {
                    type: 'string'
                  }
                },
                {
                  name: 'content-type',
                  in: 'header',
                  required: false,
                  schema: {
                    type: 'string'
                  },
                  description: 'another bad parameter'
                },
                {
                  name: 'Authorization',
                  in: 'header',
                  description: 'Identity Access Management (IAM) bearer token.',
                  required: false,
                  schema: {
                    type: 'string'
                  }
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.warnings.length).toEqual(1);
      expect(res.errors.length).toEqual(2);
      expect(res.errors[0].path).toEqual([
        'paths',
        '/pets',
        'get',
        'parameters',
        '1'
      ]);
      expect(res.errors[0].message).toEqual(
        'Parameters must not explicitly define `Accept`. Rely on the `content` field of a response object to specify accept-type.'
      );
      expect(res.errors[1].path).toEqual([
        'paths',
        '/pets',
        'get',
        'parameters',
        '2'
      ]);
      expect(res.errors[1].message).toEqual(
        'Parameters must not explicitly define `Content-Type`. Rely on the `content` field of a request body or response object to specify content-type.'
      );
      expect(res.warnings[0].path).toEqual([
        'paths',
        '/pets',
        'get',
        'parameters',
        '3'
      ]);
      expect(res.warnings[0].message).toEqual(
        'Parameters must not explicitly define `Authorization`. Rely on the `securitySchemes` and `security` fields to specify authorization methods. This check will be converted to an `error` in an upcoming release.'
      );
    });

    it('should return an error when a parameter does not have a description', () => {
      const spec = {
        components: {
          parameters: {
            BadParam: {
              in: 'query',
              name: 'bad_query_param',
              schema: {
                type: 'string'
              }
            }
          }
        }
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual([
        'components',
        'parameters',
        'BadParam'
      ]);
      expect(res.errors[0].message).toEqual(
        'Parameter objects must have a `description` field.'
      );
    });

    it('should flag a required parameter that specifies a default value', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'tags',
                  in: 'query',
                  required: true,
                  description: 'tags to filter by',
                  schema: {
                    type: 'string',
                    default: 'reptile'
                  }
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].path).toEqual([
        'paths',
        '/pets',
        'get',
        'parameters',
        '0'
      ]);
      expect(res.warnings[0].message).toEqual(
        'Required parameters should not specify default values.'
      );
      expect(res.errors.length).toEqual(0);
    });

    it('should not flag an optional parameter that does not specify a default value', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'tags',
                  in: 'query',
                  description: 'tags to filter by',
                  schema: {
                    type: 'string'
                  }
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(0);
    });

    it('should complain about parameters not defined properly in a path item ', () => {
      const spec = {
        paths: {
          '/pets': {
            parameters: [
              {
                name: 'tags',
                in: 'query',
                schema: {
                  type: 'string',
                  format: 'byte'
                }
              }
            ]
          }
        }
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].message).toEqual(
        'Parameter objects must have a `description` field.'
      );
    });
  });
});
