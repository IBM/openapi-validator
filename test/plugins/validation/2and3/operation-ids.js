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
    expect(res.warnings.length).toEqual(1);
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
    expect(res.warnings.length).toEqual(1);
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
    expect(res.warnings.length).toEqual(1);
  });

  it('should complain about operationId naming convention', async function() {
    const spec = {
      paths: {
        '/books': {
          get: {
            operationId: "getBooks"
          },
          post: {
            operationId: "changeBooks"
          }
        },
        '/coffee': {
          get: {
            operationId: "get books"
          },
          post: {
            operationId: "change_books"
          }
        },
        '/books/{id}': {
          parameters: [
            {
              name: 'id',
              in: 'path'
            }
          ],
          get: {
            operationId: "listBooks"
          },
          delete: {
            operationId: "removeBooks"
          },
          post: {
            operationId: "changeBooks1"
          },
          put: {
            operationId: "changeBooks2"
          },
          patch: {
            operationId: "changeBooks3"
          }
        }
      }
    }

    const resolvedSpec = await resolver.dereference(spec);
    const res = validate({ resolvedSpec });

    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(9);
    expect(res.warnings[0].path).toEqual('paths./books.get.operationId');
    expect(res.warnings[0].message).toEqual('operationIds should follow consistent naming convention');
  });

  it('should not complain about operationId naming convention', async function() {
    const spec = {
      paths: {
        '/books': {
          get: {
            operationId: "listBooks"
          },
          post: {
            operationId: "addBooks"
          }
        },
        '/coffee': {
          get: {
            operationId: "list_coffee"
          },
          post: {
            operationId: "add_coffee"
          }
        },
        '/books/{id}': {
          parameters: [
            {
              name: 'id',
              in: 'path'
            }
          ],
          get: {
            operationId: "getBook"
          },
          delete: {
            operationId: "deleteBook"
          },
          post: {
            operationId: "updateBook1"
          },
          put: {
            operationId: "updateBook2"
          },
          patch: {
            operationId: "updateBook3"
          }
        },
        '/coffee/{id}': {
          parameters: [
            {
              name: 'id',
              in: 'path'
            }
          ],
          get: {
            operationId: "get_coffee"
          },
          delete: {
            operationId: "delete_book"
          },
          post: {
            operationId: "update_book_1"
          },
          put: {
            operationId: "update_book_2"
          },
          patch: {
            operationId: "update_book_3"
          }
        }
      }
    }

    const resolvedSpec = await resolver.dereference(spec);
    const res = validate({ resolvedSpec });

    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });
});
