const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/oas3/semantic-validators/security-definitions-ibm');

describe('it should have a type of `apiKey`,`http`,`oauth2`, `openIdConnect`', function() {
  it('should have a type', function() {
    const spec = {
      components: {
        securitySchemes: {
          SecuritySchemeModel: {
            scheme: 'basic'
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors[0].message).toEqual(
      "'type' must be defined as a string and is required for path: securitySchemes.SecuritySchemeModel"
    );
  });
  it('type can only be `apiKey`, `http`, `oauth2`, `openIdConnect`', function() {
    const spec = {
      components: {
        securitySchemes: {
          SecuritySchemeModel: {
            type: 'wrong type',
            scheme: 'basic',
            description: 'example text'
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors[0].message).toEqual(
      '`type` must have one of the following types: `apiKey`, `oauth2`, `http`, `openIdConnect`'
    );
  });
});

describe('if the type is `apiKey` then it should have `query`, `header` or `cookie` as well as `name`', function() {
  it('if type is `apiKey`, then the `in` property should be defined and can only be `query`, `header` or `cookie`.', function() {
    const spec = {
      components: {
        securitySchemes: {
          SecuritySchemeModel: {
            type: 'apiKey',
            name: 'apiKey',
            scheme: 'basic',
            descriptions: 'example text'
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors[0].message).toEqual(
      "apiKey authorization must have required 'in' property, valid values are 'query' or 'header' or 'cookie'."
    );
  });
  it('if type is `apiKey`, then the `name` property should be defined and should be the name of the header or query parameter', function() {
    const spec = {
      components: {
        securitySchemes: {
          SecuritySchemeModel: {
            type: 'apiKey',
            in: 'cookie',
            scheme: 'basic',
            descriptions: 'example text'
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors[0].message).toEqual(
      "apiKey authorization must have required 'name' string property. The name of the header or query parameter to be used."
    );
  });
});

describe('if the type is `oauth2` then it should have flows and flows should follow the spec requirements', function() {
  it('should have flows parameter if type is oauth2', function() {
    const spec = {
      components: {
        securitySchemes: {
          SecuritySchemeModel: {
            type: 'oauth2'
          },
          authorizationCode: {
            authorizationUrl: 'https://example.com/api/oauth/dialog',
            tokenUrl: 'https://example.com/api/oauth/token'
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.errors.length).toEqual(2);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors[0].message).toEqual(
      "oauth2 authorization must have required 'flows'. Valid values are 'implicit', 'password', 'clientCredentials' or 'authorizationCode'" //////recieved
    );
  });
  it('should have `authorizationUrl` if flows is `implicit`', function() {
    const spec = {
      components: {
        securitySchemes: {
          SecuritySchemeModel: {
            type: 'oauth2',
            flows: {
              implicit: {
                authurl: 'not real url',
                scopes: {}
              }
            }
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors[0].message).toEqual(
      "oauth2 authorization implicit flow must have required 'authorizationUrl' parameter if type is `implicit` or `authorizationCode`." // expeceted
    );
  });
  it('should have `authorizationUrl` and `tokenUrl` if type is `oauth2` and flow is `authorizationCode` or `password`', function() {
    const spec = {
      components: {
        securitySchemes: {
          SecuritySchemeModel: {
            type: 'oauth2',
            flows: {
              authorizationCode: {
                authorizationUrl: 'https://example.com/api/oauth/dialog',
                scopes: {}
              }
            }
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors[0].message).toEqual(
      "oauth2 authorization implicit flow must have required 'authorizationUrl' parameter if type is `implicit` or `authorizationCode`."
    );
  });
  it('should have `scopes` defined as an object if type is `oauth2`', function() {
    const spec = {
      components: {
        securitySchemes: {
          SecuritySchemeModel: {
            type: 'oauth2',
            in: 'cookie',
            name: 'cookie',
            scheme: 'Basic',
            flows: {
              implicit: {
                authorizationUrl: 'https://example.com/api/oauth/dialog'
              }
            }
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors[0].message).toEqual(
      "oauth2 authorization implicit flow must have required 'scopes' property."
    );
  });
});

describe('if `type` is `http`, then scheme property must be defined', function() {
  it('should have a defined scheme if type is `http`', function() {
    const spec = {
      components: {
        securitySchemes: {
          SecuritySchemeModel: {
            type: 'http',
            descriptions: 'example text'
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors[0].message).toEqual(
      'scheme must be defined for type `http` and must be a string'
    );
  });
});

describe('if `type` is `openIdConnect` then `openIdConnectUrl` must be defined and valid', function() {
  it('should have `openIdConnectUrl` propery if the type is defined as `openIdConnect`', function() {
    const spec = {
      components: {
        securitySchemes: {
          SecuritySchemeModel: {
            type: 'openIdConnect',
            openIdConnectUrl: 2,
            scheme: 'basic',
            descriptions: 'example text'
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors[0].message).toEqual(
      'openIdConnectUrl must be defined for openIdConnect property and must be a valid URL'
    );
  });
});
