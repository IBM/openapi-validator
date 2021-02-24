const expect = require('expect');
const resolver = require('json-schema-ref-parser');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/operation-ids');
const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - operation-ids', function() {
  it('should complain about operationId naming convention', async function() {
    const spec = {
      paths: {
        '/books': {
          get: {
            operationId: 'getBooks'
          },
          post: {
            operationId: 'changeBooks'
          }
        },
        '/coffee': {
          get: {
            operationId: 'get_books'
          },
          post: {
            operationId: 'change_books'
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
            operationId: 'listBooks'
          },
          delete: {
            operationId: 'removeBook'
          },
          post: {
            operationId: 'updatesBook'
          },
          put: {
            operationId: 'changeBook'
          },
          patch: {
            operationId: 'changeBook2'
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
            operationId: 'listCoffee'
          },
          delete: {
            operationId: 'removeCoffee'
          },
          post: {
            operationId: 'changeCoffee'
          },
          put: {
            operationId: 'changeCoffee2'
          }
        }
      }
    };

    const resolvedSpec = await resolver.dereference(spec);
    const res = validate({ resolvedSpec }, config);

    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(12);
    expect(res.warnings[0].path).toEqual('paths./books.get.operationId');
    expect(res.warnings[0].message).toEqual(
      'operationIds should follow naming convention: operationId verb should be list'
    );
  });

  it('should not complain about operationId naming convention', async function() {
    const spec = {
      paths: {
        '/books': {
          get: {
            operationId: 'listBooks'
          },
          post: {
            operationId: 'addBooks'
          },
          delete: {
            operationId: 'deleteAllBooks'
          }
        },
        '/coffee': {
          get: {
            operationId: 'list_coffee'
          },
          post: {
            operationId: 'add_coffee'
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
            operationId: 'getBook'
          },
          delete: {
            operationId: 'deleteBook'
          },
          post: {
            operationId: 'addBook'
          },
          put: {
            operationId: 'replaceBook'
          },
          patch: {
            operationId: 'updateBook'
          },
          head: {
            operationId: 'headBook'
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
            operationId: 'get_coffee'
          },
          delete: {
            operationId: 'delete_coffee'
          },
          post: {
            operationId: 'create_coffee'
          },
          put: {
            operationId: 'replace_coffee'
          },
          patch: {
            operationId: 'update_coffee'
          }
        }
      }
    };

    const resolvedSpec = await resolver.dereference(spec);
    const res = validate({ resolvedSpec }, config);

    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });
});
