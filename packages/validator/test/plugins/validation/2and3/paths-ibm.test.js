const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/paths-ibm');

describe('validation plugin - semantic - paths-ibm', function() {
  it('should return an error when a path parameter is not correctly defined in an operation', function() {
    const config = {
      paths: {
        missing_path_parameter: 'error'
      }
    };

    const spec = {
      paths: {
        '/cool_path/{id}': {
          get: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                description: 'good parameter',
                required: true,
                type: 'integer',
                format: 'int64'
              }
            ]
          },
          post: {
            parameters: [
              {
                name: 'id',
                in: 'body',
                description: 'bad parameter',
                required: true,
                type: 'integer',
                format: 'int64'
              }
            ]
          }
        },
        '/bogus/{id}/foo/{foo}/bar': {
          post: {
            parameters: [
              {
                name: 'baz',
                in: 'query',
                type: 'string'
              }
            ]
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.errors.length).toEqual(3);
    expect(res.warnings.length).toEqual(0);
    expect(res.errors[0].path).toEqual([
      'paths',
      '/cool_path/{id}',
      'post',
      'parameters'
    ]);
    expect(res.errors[0].message).toEqual(
      'Operation must include a path parameter with name: id.'
    );
    expect(res.errors[1].path).toEqual([
      'paths',
      '/bogus/{id}/foo/{foo}/bar',
      'post',
      'parameters'
    ]);
    expect(res.errors[1].message).toEqual(
      'Operation must include a path parameter with name: id.'
    );
    expect(res.errors[2].path).toEqual([
      'paths',
      '/bogus/{id}/foo/{foo}/bar',
      'post',
      'parameters'
    ]);
    expect(res.errors[2].message).toEqual(
      'Operation must include a path parameter with name: foo.'
    );
  });

  it('should not return an error for a missing path parameter when a path defines a global parameter', function() {
    const config = {
      paths: {
        missing_path_parameter: 'error'
      }
    };

    const spec = {
      paths: {
        '/cool_path/{id}': {
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'good global parameter',
              required: true,
              type: 'integer',
              format: 'int64'
            }
          ],
          get: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                description: 'good overriding parameter',
                required: true,
                type: 'integer',
                format: 'int64'
              }
            ]
          },
          post: {
            parameters: [
              {
                name: 'id',
                in: 'body',
                description: 'bad parameter',
                required: true,
                type: 'integer',
                format: 'int64'
              }
            ]
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should not return an error when incorrect path parameter is in an excluded operation', function() {
    const config = {
      paths: {
        missing_path_parameter: 'error'
      }
    };

    const spec = {
      paths: {
        '/cool_path/{id}': {
          get: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                description: 'good parameter',
                required: true,
                type: 'integer',
                format: 'int64'
              }
            ]
          },
          post: {
            'x-sdk-exclude': true,
            parameters: [
              {
                name: 'id',
                in: 'body',
                description: 'bad parameter',
                required: true,
                type: 'integer',
                format: 'int64'
              }
            ]
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should not return an error when incorrect path parameter is in a vendor extension', function() {
    const config = {
      paths: {
        missing_path_parameter: 'error'
      }
    };

    const spec = {
      paths: {
        '/cool_path/{id}': {
          get: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                description: 'good parameter',
                required: true,
                type: 'integer',
                format: 'int64'
              }
            ]
          },
          'x-vendor-post': {
            parameters: [
              {
                name: 'id',
                in: 'body',
                description: 'bad parameter',
                required: true,
                type: 'integer',
                format: 'int64'
              }
            ]
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should return one problem for an undefined declared path parameter', function() {
    const config = {
      paths: {
        missing_path_parameter: 'error'
      }
    };

    const spec = {
      paths: {
        '/cool_path/{id}': {}
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].message).toEqual(
      'Path parameter must be defined at the path or the operation level: id.'
    );
    expect(res.errors[0].path).toEqual(['paths', '/cool_path/{id}']);
  });

  it('should return one problem for an undefined declared path parameter', function() {
    const config = {
      paths: {
        missing_path_parameter: 'error'
      }
    };

    const spec = {
      paths: {
        '/cool_path/{id}/more_path/{other_param}': {
          parameters: [
            {
              in: 'path',
              name: 'other_param',
              description: 'another parameter',
              type: 'string'
            }
          ]
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].message).toEqual(
      'Path parameter must be defined at the path or the operation level: id.'
    );
    expect(res.errors[0].path).toEqual([
      'paths',
      '/cool_path/{id}/more_path/{other_param}'
    ]);
  });

  it('should flag a path segment that is not snake_case but should ignore path parameter', function() {
    const config = {
      paths: {
        snake_case_only: 'warning'
      }
    };

    const spec = {
      paths: {
        '/v1/api/NotGoodSegment/{shouldntMatter}/resource': {
          parameters: [
            {
              in: 'path',
              name: 'shouldntMatter',
              description:
                'bad parameter but should be caught by another validator, not here',
              type: 'string'
            }
          ]
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/v1/api/NotGoodSegment/{shouldntMatter}/resource'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Path segments must be lower snake case.'
    );
  });

  it('should flag a path segment with a period in the name', function() {
    const config = {
      paths: {
        snake_case_only: 'off',
        paths_case_convention: ['warning', 'lower_snake_case']
      }
    };

    const spec = {
      paths: {
        '/v1/api/not.good_.segment/{id}/resource': {
          parameters: [
            {
              in: 'path',
              name: 'id',
              description: 'id param',
              type: 'string'
            }
          ]
        }
      }
    };

    const res = validate({ resolvedSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/v1/api/not.good_.segment/{id}/resource'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Path segments must follow case convention: lower_snake_case'
    );
  });

  it('should flag a path segment that does not follow paths_case_convention but should ignore path parameter', function() {
    const config = {
      paths: {
        snake_case_only: 'off',
        paths_case_convention: ['warning', 'lower_camel_case']
      }
    };

    const badSpec = {
      paths: {
        '/v1/api/NotGoodSegment/{shouldntMatter}/resource': {
          parameters: [
            {
              in: 'path',
              name: 'shouldntMatter',
              description:
                'bad parameter but should be caught by another validator, not here',
              type: 'string'
            }
          ]
        }
      }
    };

    const res = validate({ resolvedSpec: badSpec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/v1/api/NotGoodSegment/{shouldntMatter}/resource'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Path segments must follow case convention: lower_camel_case'
    );
  });

  it('should not flag a path segment that follows paths_case_convention and should ignore path parameter', function() {
    const config = {
      paths: {
        snake_case_only: 'off',
        paths_case_convention: ['warning', 'lower_dash_case']
      }
    };

    const goodSpec = {
      paths: {
        '/v1/api/good-segment/{shouldntMatter}/the-resource': {
          parameters: [
            {
              in: 'path',
              name: 'shouldntMatter',
              description:
                'bad parameter but should be caught by another validator, not here',
              type: 'string'
            }
          ]
        }
      }
    };

    const res = validate({ resolvedSpec: goodSpec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should flag a common path parameter defined at the operation level', function() {
    const config = {
      paths: {
        duplicate_path_parameter: 'warning'
      }
    };

    const badSpec = {
      paths: {
        '/v1/api/resources/{id}': {
          get: {
            operationId: 'get_resource',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                type: 'string',
                description: 'id of the resource'
              }
            ]
          },
          post: {
            operationId: 'update_resource',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                type: 'string',
                description: 'id of the resource'
              }
            ]
          }
        }
      }
    };

    const res = validate({ resolvedSpec: badSpec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(2);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/v1/api/resources/{id}',
      'get',
      'parameters',
      '0'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Common path parameters should be defined on path object'
    );
    expect(res.warnings[1].path).toEqual([
      'paths',
      '/v1/api/resources/{id}',
      'post',
      'parameters',
      '0'
    ]);
    expect(res.warnings[1].message).toEqual(
      'Common path parameters should be defined on path object'
    );
  });

  it('should not flag a common path parameter defined at the operation level if descriptions are different', function() {
    const config = {
      paths: {
        duplicate_path_parameter: 'warning'
      }
    };

    const goodSpec = {
      paths: {
        '/v1/api/resources/{id}': {
          get: {
            operationId: 'get_resource',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                type: 'string',
                description: 'id of the resource to retrieve'
              }
            ]
          },
          post: {
            operationId: 'update_resource',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                type: 'string',
                description: 'id of the resource to update'
              }
            ]
          }
        }
      }
    };

    const res = validate({ resolvedSpec: goodSpec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should not flag a common path parameter defined at the path level', function() {
    const config = {
      paths: {
        duplicate_path_parameter: 'warning'
      }
    };

    const goodSpec = {
      paths: {
        '/v1/api/resources/{id}': {
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              type: 'string',
              description: 'id of the resource to retrieve'
            }
          ],
          get: {
            operationId: 'get_resource'
          },
          post: {
            operationId: 'update_resource'
          }
        }
      }
    };

    const res = validate({ resolvedSpec: goodSpec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should catch redundant path parameter that exists in one operation but not the other', function() {
    const config = {
      paths: {
        duplicate_path_parameter: 'warning'
      }
    };

    const goodSpec = {
      paths: {
        '/v1/api/resources/{id}': {
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              type: 'string',
              description: 'id of the resource to retrieve'
            }
          ],
          get: {
            operationId: 'get_resource',
            parameters: [
              {
                name: 'id',
                in: 'path'
              }
            ]
          },
          post: {
            operationId: 'update_resource'
          }
        }
      }
    };

    const res = validate({ resolvedSpec: goodSpec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/v1/api/resources/{id}',
      'get',
      'parameters',
      '0'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Common path parameters should be defined on path object'
    );
  });
});
