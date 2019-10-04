const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/security-ibm');

const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - security-ibm', function() {
  describe('Swagger 2', function() {
    it('should return an error when an operation references a non-existing security scope', () => {
      const spec = {
        securityDefinitions: {
          api_key: {
            type: 'oauth2',
            name: 'apikey',
            in: 'query',
            scopes: {
              asdf: 'blah blah'
            }
          }
        },
        paths: {
          '/': {
            get: {
              description: 'asdf',
              security: [
                {
                  api_key: ['write:pets']
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual('paths./.get.security.api_key.0');
      expect(res.errors[0].message).toEqual(
        'Definition could not be resolved for security scope: write:pets'
      );
      expect(res.warnings.length).toEqual(0);
    });

    it('should return an error when an operation references a non-existing security definition', () => {
      const spec = {
        securityDefinitions: {
          api_key: {
            type: 'apiKey',
            name: 'apikey',
            in: 'query'
          }
        },
        paths: {
          '/': {
            get: {
              description: 'asdf',
              security: [
                {
                  fictional_security_definition: ['write:pets']
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(
        'paths./.get.security.fictional_security_definition'
      );
      expect(res.errors[0].message).toEqual(
        'security requirements must match a security definition'
      );
      expect(res.warnings.length).toEqual(0);
    });

    it('should not return an error when an operation references an existing security scope', () => {
      const spec = {
        securityDefinitions: {
          api_key: {
            type: 'oauth2',
            name: 'apikey',
            in: 'query',
            scopes: {
              'write:pets': 'write to pets'
            }
          }
        },
        paths: {
          '/': {
            get: {
              description: 'asdf',
              security: [
                {
                  api_key: ['write:pets']
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

    it('should error on a non-empty array for security object that is not of type oauth2', function() {
      const spec = {
        securityDefinitions: {
          basicAuth: {
            type: 'basic'
          },
          coolApiAuth: {
            type: 'oauth2',
            scopes: {
              'read:coolData': 'read some cool data'
            }
          }
        },
        security: [
          {
            basicAuth: ['not a good place for a scope']
          }
        ],
        paths: {
          'CoolPath/secured': {
            get: {
              operationId: 'secureGet',
              summary: 'secure get operation',
              security: [
                {
                  coolApiAuth: ['read:coolData']
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors[0].message).toEqual(
        'For security scheme types other than oauth2, the value must be an empty array.'
      );
      expect(res.errors[0].path).toEqual('security.basicAuth');
    });

    it('should not error on a non-empty array for security object of type oauth2', function() {
      const spec = {
        securityDefinitions: {
          basicAuth: {
            type: 'basic'
          },
          coolApiAuth: {
            type: 'oauth2',
            scopes: {
              'read:coolData': 'read some cool data'
            }
          }
        },
        security: [
          {
            basicAuth: []
          }
        ],
        paths: {
          'CoolPath/secured': {
            get: {
              operationId: 'secureGet',
              summary: 'secure get operation',
              security: [
                {
                  coolApiAuth: ['read:coolData']
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

    it('should not validate an object property with the name "security"', function() {
      const spec = {
        paths: {
          'CoolPath/secured': {
            get: {
              operationId: 'secureGet',
              summary: 'secure get operation',
              responses: {
                default: {
                  description: 'test response',
                  schema: {
                    type: 'object',
                    properties: {
                      security: {
                        type: 'string',
                        description: 'just an innocent string'
                      }
                    }
                  }
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
  });

  describe('OpenAPI 3', function() {
    it('should return an error when an operation references a non-existing security scope', () => {
      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: 'oauth2',
              description: 'just a test',
              flows: {
                implicit: {
                  authorizationUrl: 'https://example.com/api/oauth',
                  scopes: {
                    'read:pets': "you can read but you can't write"
                  }
                }
              }
            }
          }
        },
        paths: {
          '/': {
            get: {
              description: 'asdf',
              security: [
                {
                  TestAuth: ['write:pets']
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual('paths./.get.security.TestAuth.0');
      expect(res.errors[0].message).toEqual(
        'Definition could not be resolved for security scope: write:pets'
      );
      expect(res.warnings.length).toEqual(0);
    });

    it('should return an error when one of a few scopes is undefined', () => {
      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: 'oauth2',
              description: 'just a test',
              flows: {
                implicit: {
                  authorizationUrl: 'https://example.com/api/oauth',
                  scopes: {
                    'read:pets': "you can read but you can't write",
                    'read:houses': "you can read but you can't write",
                    'write:houses': "you can write but you can't read"
                  }
                }
              }
            }
          }
        },
        paths: {
          '/': {
            get: {
              description: 'asdf',
              security: [
                {
                  TestAuth: [
                    'write:houses',
                    'read:houses',
                    'write:pets',
                    'read:pets'
                  ]
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].message).toEqual(
        'Definition could not be resolved for security scope: write:pets'
      );
      expect(res.errors[0].path).toEqual('paths./.get.security.TestAuth.2');
      expect(res.warnings.length).toEqual(0);
    });

    it('should return an error when a security requirement is undefined', () => {
      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: 'oauth2',
              description: 'just a test',
              flows: {
                implicit: {
                  authorizationUrl: 'https://example.com/api/oauth',
                  scopes: {
                    'read:pets': "you can read but you can't write"
                  }
                }
              }
            }
          }
        },
        paths: {
          '/': {
            get: {
              description: 'asdf',
              security: [
                {
                  UndefinedAuth: ['read:pets']
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].message).toEqual(
        'security requirements must match a security definition'
      );
      expect(res.errors[0].path).toEqual('paths./.get.security.UndefinedAuth');
      expect(res.warnings.length).toEqual(0);
    });

    it('should not return an error when a security requirement references an existing security scope', () => {
      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: 'oauth2',
              description: 'just a test',
              flows: {
                implicit: {
                  authorizationUrl: 'https://example.com/api/oauth',
                  scopes: {
                    'read:pets': "you can read but you can't write"
                  }
                }
              }
            }
          }
        },
        security: [
          {
            TestAuth: ['read:pets']
          }
        ]
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });

    it('should not return an error when referencing a non-existing scope for type openIdConnet', () => {
      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: 'openIdConnect',
              description: 'just a test',
              openIdConnectUrl: 'https://auth.com/openId'
            }
          }
        },
        paths: {
          '/': {
            get: {
              description: 'asdf',
              security: [
                {
                  TestAuth: ['write:pets']
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });

    it('should error on a non-empty array for security req that is not oauth2 or openIdConnect', function() {
      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: 'apikey'
            }
          }
        },
        paths: {
          '/': {
            get: {
              operationId: 'secureGet',
              summary: 'secure get operation',
              security: [
                {
                  TestAuth: ['read:coolData']
                }
              ]
            }
          }
        }
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors[0].message).toEqual(
        'For security scheme types other than oauth2 or openIdConnect, the value must be an empty array.'
      );
      expect(res.errors[0].path).toEqual('paths./.get.security.TestAuth');
    });

    it('should not error on a non-empty array for security req that is of type oauth2', function() {
      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: 'oauth2',
              flows: {
                implicit: {
                  authorizationUrl: 'https://auth.com',
                  scopes: {
                    'write:pets': 'write access'
                  }
                },
                password: {
                  tokenUrl: 'https://auth.com/token',
                  scopes: {
                    'read:pets': 'read access'
                  }
                }
              }
            }
          }
        },
        security: [
          {
            TestAuth: ['read:pets']
          }
        ]
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });

    it('should not error on a non-empty array for security object that is of type openIdConnect', function() {
      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: 'openIdConnect',
              openIdConnectUrl: 'https://auth.com/openId'
            }
          }
        },
        security: [
          {
            TestAuth: ['read:pets']
          }
        ]
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });

    it('should not complain when multiple security requirements are referenced', () => {
      const spec = {
        components: {
          securitySchemes: {
            api_key: {
              type: 'apiKey',
              name: 'api_key',
              in: 'header'
            },
            api_secret: {
              type: 'apiKey',
              name: 'api_secret',
              in: 'header'
            }
          }
        },
        security: [
          {
            api_key: [],
            api_secret: []
          }
        ]
      };

      const res = validate({ jsSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });
  });
});
