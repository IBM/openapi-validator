const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/swagger2/semantic-validators/operations-ibm');

describe('validation plugin - semantic - operations-ibm - swagger2', function() {
  it('should complain about a missing consumes with content', function() {
    const config = {
      operations: {
        no_consumes_for_put_or_post: 'error'
      }
    };

    const spec = {
      paths: {
        '/CoolPath': {
          put: {
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                name: 'BadParameter',
                in: 'body',
                schema: {
                  required: ['Property'],
                  properties: [
                    {
                      name: 'Property'
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual('paths./CoolPath.put.consumes');
    expect(res.errors[0].message).toEqual(
      'PUT and POST operations must have a non-empty `consumes` field.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain about an empty consumes', function() {
    const config = {
      operations: {
        no_consumes_for_put_or_post: 'error'
      }
    };

    const spec = {
      paths: {
        '/CoolPath': {
          post: {
            consumes: [' '],
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                name: 'BadParameter',
                in: 'body',
                schema: {
                  required: ['Property'],
                  properties: [
                    {
                      name: 'Property'
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual('paths./CoolPath.post.consumes');
    expect(res.errors[0].message).toEqual(
      'PUT and POST operations must have a non-empty `consumes` field.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should not complain about a missing consumes when there is a global consumes', function() {
    const config = {
      operations: {
        no_consumes_for_put_or_post: 'error'
      }
    };

    const spec = {
      consumes: ['text/plain'],
      paths: {
        '/CoolPath': {
          put: {
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                name: 'NotABadParameter',
                in: 'body',
                schema: {
                  required: ['Property'],
                  properties: [
                    {
                      name: 'Property'
                    }
                  ]
                }
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

  it('should complain about a get operation having consumes', function() {
    const config = {
      operations: {
        get_op_has_consumes: 'warning'
      }
    };

    const spec = {
      paths: {
        '/CoolPath': {
          get: {
            consumes: ['application/json'],
            produces: ['application/json'],
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                name: 'Parameter',
                in: 'body',
                schema: {
                  required: ['Property'],
                  properties: [
                    {
                      name: 'Property'
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual('paths./CoolPath.get.consumes');
    expect(res.warnings[0].message).toEqual(
      'GET operations should not specify a consumes field.'
    );
    expect(res.errors.length).toEqual(0);
  });

  it('should complain about a get operation not having produces', function() {
    const config = {
      operations: {
        no_produces_for_get: 'error'
      }
    };

    const spec = {
      paths: {
        '/CoolPath': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                name: 'Parameter',
                in: 'body',
                schema: {
                  required: ['Property'],
                  properties: [
                    {
                      name: 'Property'
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual('paths./CoolPath.get.produces');
    expect(res.errors[0].message).toEqual(
      'GET operations must have a non-empty `produces` field.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should not complain about a missing produces when there is a global produces', function() {
    const config = {
      operations: {
        no_produces_for_get: 'error'
      }
    };

    const spec = {
      produces: ['application/json'],
      paths: {
        '/CoolPath': {
          get: {
            summary: 'this is a summary',
            operationId: 'operationId',
            parameters: [
              {
                name: 'Parameter',
                in: 'body',
                schema: {
                  required: ['Property'],
                  properties: [
                    {
                      name: 'Property'
                    }
                  ]
                }
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
});
