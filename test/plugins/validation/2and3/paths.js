const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/paths');

describe('validation plugin - semantic - paths', function() {
  describe('Path parameter definitions need matching paramater declarations', function() {
    it('should not return problems for a valid definiton/declaration pair', function() {
      const spec = {
        paths: {
          '/CoolPath/{id}': {
            parameters: [
              {
                name: 'id',
                in: 'path',
                description: 'An id'
              }
            ]
          }
        }
      };

      const res = validate({ resolvedSpec: spec });
      expect(res.errors).toEqual([]);
      expect(res.warnings).toEqual([]);
    });
  });

  describe('Empty path templates are not allowed', () => {
    it('should return one problem for an empty path template', function() {
      const spec = {
        paths: {
          '/CoolPath/{}': {}
        }
      };

      const res = validate({ resolvedSpec: spec });
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].message).toEqual(
        'Empty path parameter declarations are not valid'
      );
      expect(res.errors[0].path).toEqual('paths./CoolPath/{}');
    });

    describe('Path strings must be equivalently different', () => {
      it('should return one problem for an equivalent templated path strings', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              parameters: [
                {
                  name: 'id',
                  in: 'path'
                }
              ]
            },
            '/CoolPath/{count}': {
              parameters: [
                {
                  name: 'count',
                  in: 'path'
                }
              ]
            }
          }
        };

        const res = validate({ resolvedSpec: spec });
        expect(res.errors[0].message).toEqual(
          'Equivalent paths are not allowed.'
        );
        expect(res.errors[0].path).toEqual('paths./CoolPath/{count}');
      });

      it('should return no problems for a templated and untemplated pair of path strings', function() {
        const spec = {
          paths: {
            '/CoolPath/': {},
            '/CoolPath/{count}': {
              parameters: [
                {
                  name: 'count',
                  in: 'path'
                }
              ]
            }
          }
        };

        const res = validate({ resolvedSpec: spec });
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(0);
      });

      it('should return no problems for a templated and double-templated set of path strings', function() {
        const spec = {
          paths: {
            '/CoolPath/{group_id}/all': {
              parameters: [
                {
                  name: 'group_id',
                  in: 'path'
                }
              ]
            },
            '/CoolPath/{group_id}/{user_id}': {
              parameters: [
                {
                  name: 'group_id',
                  in: 'path'
                },
                {
                  name: 'user_id',
                  in: 'path'
                }
              ]
            }
          }
        };

        const res = validate({ resolvedSpec: spec });
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(0);
      });
    });

    describe('Paths must have unique name + in parameters', () => {
      it('should return one problem for an name + in collision', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              parameters: [
                {
                  name: 'id',
                  in: 'path'
                }
              ]
            },
            '/CoolPath/{count}': {
              parameters: [
                {
                  name: 'count',
                  in: 'path'
                }
              ]
            }
          }
        };

        const res = validate({ resolvedSpec: spec });
        expect(res.errors.length).toEqual(1);
        expect(res.errors[0].message).toEqual(
          'Equivalent paths are not allowed.'
        );
        expect(res.errors[0].path).toEqual('paths./CoolPath/{count}');
      });

      it('should return no problems for an name collision only', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              parameters: [
                {
                  name: 'id',
                  in: 'path'
                },
                {
                  name: 'id',
                  in: 'query'
                }
              ]
            }
          }
        };

        const res = validate({ resolvedSpec: spec });
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(0);
      });

      it("should return no problems when 'in' is not defined", function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              parameters: [
                {
                  name: 'id',
                  in: 'path'
                },
                {
                  name: 'id'
                  // in: "path"
                }
              ]
            }
          }
        };

        const res = validate({ resolvedSpec: spec });
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(0);
      });
    });

    describe('Paths cannot have partial templates', () => {
      it('should return one problem for an illegal partial path template', function() {
        const spec = {
          paths: {
            '/CoolPath/user{id}': {
              parameters: [
                {
                  name: 'id',
                  in: 'path'
                }
              ]
            }
          }
        };

        const res = validate({ resolvedSpec: spec });
        expect(res.errors.length).toEqual(1);
        expect(res.errors[0].message).toEqual(
          'Partial path templating is not allowed.'
        );
        expect(res.errors[0].path).toEqual('paths./CoolPath/user{id}');
      });

      it('should return no problems for a correct path template', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              parameters: [
                {
                  name: 'id',
                  in: 'path'
                }
              ]
            }
          }
        };

        const res = validate({ resolvedSpec: spec });
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(0);
      });
    });

    describe('Paths cannot have query strings in them', () => {
      it("should return one problem for an stray '?' in a path string", function() {
        const spec = {
          paths: {
            '/report?': {}
          }
        };

        const res = validate({ resolvedSpec: spec });
        expect(res.errors.length).toEqual(1);
        expect(res.errors[0].message).toEqual(
          'Query strings in paths are not allowed.'
        );
        expect(res.errors[0].path).toEqual('paths./report?');
      });

      it('should return no problems for a correct path template', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              parameters: [
                {
                  name: 'id',
                  in: 'path'
                }
              ]
            }
          }
        };

        const res = validate({ resolvedSpec: spec });
        expect(res.errors.length).toEqual(0);
        expect(res.warnings.length).toEqual(0);
      });
    });

    describe('Integrations', () => {
      it('should return two problems for an illegal query string in a path string', function() {
        const spec = {
          paths: {
            '/report?rdate={relative_date}': {
              parameters: [
                {
                  name: 'relative_date',
                  in: 'path'
                }
              ]
            }
          }
        };

        const res = validate({ resolvedSpec: spec });
        expect(res.errors.length).toEqual(2);
        expect(res.errors[0].message).toEqual(
          'Partial path templating is not allowed.'
        );
        expect(res.errors[0].path).toEqual(
          'paths./report?rdate={relative_date}'
        );
        expect(res.errors[1].message).toEqual(
          'Query strings in paths are not allowed.'
        );
        expect(res.errors[1].path).toEqual(
          'paths./report?rdate={relative_date}'
        );
      });

      it.skip('should return two problems for an equivalent path string missing a parameter definition', function() {
        const spec = {
          paths: {
            '/CoolPath/{id}': {
              parameters: [
                {
                  name: 'id',
                  in: 'path'
                }
              ]
            },
            '/CoolPath/{count}': {}
          }
        };

        const res = validate({ resolvedSpec: spec });
        expect(res.errors.length).toEqual(2);
        expect(res.errors[0].message).toEqual(
          'Equivalent paths are not allowed.'
        );
        expect(res.errors[0].path).toEqual('paths./CoolPath/{count}');
        expect(res.errors[1].message).toEqual(
          'Declared path parameter "count" needs to be defined as a path parameter at either the path or operation level'
        );
        expect(res.errors[1].path).toEqual('paths./CoolPath/{count}');
      });
    });

    it('should not crash when `parameters` is not an array', function() {
      const spec = {
        paths: {
          '/resource': {
            get: {
              operationId: 'listResources',
              description: 'operation with bad parameters...',
              summary: '...but it should not crash the code',
              parameters: {
                allOf: [
                  {
                    name: 'one',
                    type: 'string'
                  },
                  {
                    name: 'two',
                    type: 'string'
                  }
                ]
              },
              responses: {
                '200': {
                  description: 'response'
                }
              }
            }
          }
        }
      };

      const res = validate({ resolvedSpec: spec });
      // errors/warnings would be caught it parameters-ibm.js
      expect(res.errors.length).toBe(0);
      expect(res.warnings.length).toBe(0);
    });
  });
});
