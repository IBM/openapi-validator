const expect = require('expect');
const resolver = require('json-schema-ref-parser');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/operation-ids');

describe('validation plugin - semantic - operation-ids', function() {
  it('should complain about a repeated operationId in the same path', function() {
    const spec = {
      paths: {
        '/coolPath': {
          post: {
            summary: 'post operation',
            operationId: 'bestOperation'
          },
          get: {
            summary: 'get operation',
            operationId: 'bestOperation'
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual('paths./coolPath.get.operationId');
    expect(res.errors[0].message).toEqual('operationIds must be unique');
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain about a repeated operationId in a different path', function() {
    const spec = {
      paths: {
        '/coolPath': {
          post: {
            summary: 'post operation',
            operationId: 'bestOperation'
          },
          get: {
            summary: 'get operation',
            operation: 'getOperation'
          }
        },
        '/greatPath': {
          put: {
            summary: 'put operation',
            operationId: 'bestOperation'
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual('paths./greatPath.put.operationId');
    expect(res.errors[0].message).toEqual('operationIds must be unique');
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain about a repeated operationId in a shared path item', async function() {
    const spec = {
      paths: {
        '/coolPath': {
          $ref: '#/components/paths/SharedPath'
        },
        '/greatPath': {
          $ref: '#/components/paths/SharedPath'
        }
      },
      components: {
        paths: {
          SharedPath: {
            get: {
              operationId: 'shouldBeUnique',
              responses: {
                '200': {
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
          }
        }
      }
    };

    const resolvedSpec = await resolver.dereference(spec);

    const res = validate({ resolvedSpec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual('paths./greatPath.get.operationId');
    expect(res.errors[0].message).toEqual('operationIds must be unique');
    expect(res.warnings.length).toEqual(0);
  });

  it('should complain when parent parameter does not follow naming convention for operationId', function() {
    const spec = {
      paths: {
        '/coolPath': {
          post: {
            summary: 'post operation',
            operationId: 'insertOperation'
          },
          get: {
            summary: 'get operation',
            operationId: 'getOperation'
          }
        },
        '/coolPath/{hi}': {
          put: {
            summary: 'put operation',
            operationId: 'updateOperation'
          },
          delete: {
            summary: 'post operation',
            operationId: 'deleteOperation'
          },
          get: {
            summary: 'get operation',
            operationId: 'getOp'
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.warnings.length).toEqual(2);
    expect(res.warnings[0].message).toEqual(
      'get `operationId` in a parent parameter should begin with `list`'
    );
    expect(res.warnings[1].message).toEqual(
      'post `operationId` in a parent parameter should begin with `add` or `create`'
    );
  });

  it('should complain when query parameter does not follow naming convention for operationId', function() {
    const spec = {
      paths: {
        '/coolPath': {
          post: {
            summary: 'post operation',
            operationId: 'addOperation'
          },
          get: {
            summary: 'get operation',
            operationId: 'listOperation'
          }
        },
        '/coolPath/{hi}': {
          put: {
            summary: 'put operation',
            operationId: 'upOperation'
          },
          delete: {
            summary: 'post operation',
            operationId: 'delOperation'
          },
          get: {
            summary: 'get operation',
            operationId: 'geOp'
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.warnings.length).toEqual(3);
    expect(res.warnings[0].message).toEqual(
      'get `operationId` in query parameter should begin with `get`'
    );
    expect(res.warnings[1].message).toEqual(
      'delete `operationId` in query parameter should begin with delete'
    );
    expect(res.warnings[2].message).toEqual(
      'post/put/patch `operationId` in query parameter should begin with `update`'
    );
  });
});
