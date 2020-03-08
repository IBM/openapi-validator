const expect = require('expect');
const resolver = require('json-schema-ref-parser');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/security-definitions-ibm');

const config = {
  security_definitions: {
    unused_security_schemes: 'warning',
    unused_security_scopes: 'warning'
  }
};

describe('validation plugin - semantic - security-definitions-ibm', function() {
  describe('Swagger 2', function() {
    it('should warn about an unused security definition', function() {
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
          },
          api_key: {
            type: 'apiKey',
            name: 'api_key',
            in: 'header'
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

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].message).toEqual(
        'A security scheme is defined but never used: api_key'
      );
      expect(res.warnings[0].path).toEqual('securityDefinitions.api_key');
    });

    it('should warn about an unused security scope', function() {
      const spec = {
        securityDefinitions: {
          coolApiAuth: {
            type: 'oauth2',
            scopes: {
              'read:coolData': 'read some cool data',
              'write:otherCoolData': 'write lots of cool data',
              'read:unusedScope': 'this scope will not be used'
            }
          }
        },
        security: [
          {
            coolApiAuth: ['write:otherCoolData']
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

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].message).toEqual(
        'A security scope is defined but never used: read:unusedScope'
      );
      expect(res.warnings[0].path).toEqual(
        'securityDefinitions.coolApiAuth.scopes.read:unusedScope'
      );
    });

    it('should not complain if there are no security definitions', function() {
      const spec = {
        paths: {
          'CoolPath/secured': {
            get: {
              operationId: 'secureGet',
              summary: 'secure get operation'
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });

    it('should gracefully handle Oauth security definition with no scopes', function() {
      const spec = {
        securityDefinitions: {
          OauthSecurity: {
            type: 'oauth2',
            flow: 'implicit',
            authorizationUrl: '/auth/v1/login'
          }
        },
        security: [
          {
            OauthSecurity: []
          }
        ],
        paths: {
          '/pcloud/v1/images': {
            get: {
              operationId: 'pcloud.images.getall',
              summary: 'List all available stock images'
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });
  });

  describe('OpenAPI 3', function() {
    it('should follow references to security schemes', async function() {
      const spec = {
        components: {
          schemas: {
            SecuritySchemeModel: {
              type: 'http',
              scheme: 'basic',
              descriptions: 'example text for def with unused security def'
            }
          },
          securitySchemes: {
            scheme1: {
              $ref: '#/components/schemas/SecuritySchemeModel'
            }
          }
        }
      };

      const resolvedSpec = await resolver.dereference(spec);

      const res = validate({ resolvedSpec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].message).toEqual(
        'A security scheme is defined but never used: scheme1'
      );
    });
    it('should warn about an unused security definition', function() {
      const spec = {
        components: {
          securitySchemes: {
            UnusedAuth: {
              type: 'http',
              scheme: 'basic',
              descriptions: 'basic auth for OpenAPI 3, not used'
            },
            UsedAuth: {
              type: 'http',
              scheme: 'basic',
              descriptions: 'basic auth for OpenAPI 3, used'
            }
          }
        },
        paths: {
          '/': {
            get: {
              operationId: 'list',
              summary: 'list everything',
              security: [
                {
                  UsedAuth: []
                }
              ],
              responses: {
                default: {
                  description: 'default response'
                }
              }
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].message).toEqual(
        'A security scheme is defined but never used: UnusedAuth'
      );
      expect(res.warnings[0].path).toEqual(
        'components.securitySchemes.UnusedAuth'
      );
    });

    it('should warn about an unused security scope', function() {
      const spec = {
        components: {
          securitySchemes: {
            ScopedAuth: {
              type: 'oauth2',
              descriptions: 'oauth2 authentication',
              flows: {
                implicit: {
                  authorizationUrl: 'https://example.com/api/oauth/dialog',
                  scopes: {
                    'write:pets': 'modify pets in your account',
                    'read:pets': 'read your pets'
                  }
                }
              }
            }
          }
        },
        paths: {
          '/': {
            get: {
              operationId: 'list',
              summary: 'list everything',
              security: [
                {
                  ScopedAuth: ['read:pets']
                }
              ],
              responses: {
                default: {
                  description: 'default response'
                }
              }
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(1);
      expect(res.warnings[0].message).toEqual(
        'A security scope is defined but never used: write:pets'
      );
      expect(res.warnings[0].path).toEqual(
        'components.securitySchemes.ScopedAuth.flows.implicit.scopes.write:pets'
      );
    });

    it('should not complain if all definitions/scopes are used', function() {
      const spec = {
        components: {
          securitySchemes: {
            ScopedAuth: {
              type: 'oauth2',
              descriptions: 'oauth2 authentication',
              flows: {
                implicit: {
                  authorizationUrl: 'https://example.com/api/oauth/dialog',
                  scopes: {
                    'write:pets': 'modify pets in your account',
                    'read:pets': 'read your pets'
                  }
                }
              }
            }
          }
        },
        paths: {
          '/': {
            get: {
              operationId: 'list',
              summary: 'list everything',
              security: [
                {
                  ScopedAuth: ['read:pets', 'write:pets']
                }
              ],
              responses: {
                default: {
                  description: 'default response'
                }
              }
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });

    it('should not complain if all definitions are used with multiple auth schemes', function() {
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
        paths: {
          '/': {
            get: {
              operationId: 'list',
              summary: 'list everything',
              security: [
                {
                  api_key: [],
                  api_secret: []
                }
              ],
              responses: {
                default: {
                  description: 'default response'
                }
              }
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings.length).toEqual(0);
    });
  });
});
