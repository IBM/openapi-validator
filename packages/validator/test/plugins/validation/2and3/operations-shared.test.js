const expect = require('expect');
const resolver = require('json-schema-ref-parser');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/operations-shared');

const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - operations-shared', function() {
  describe('Swagger 2', function() {
    it('should not complain about anything when x-sdk-exclude is true', function() {
      const spec = {
        paths: {
          '/CoolPath': {
            put: {
              'x-sdk-exclude': true,
              summary: '  ',
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

      const res = validate({ resolvedSpec: spec }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(0);
    });

    it('should be able to handle parameters with `.` characters in the name', async function() {
      const spec = {
        paths: {
          '/fake/{id}': {
            get: {
              summary: 'get fake data by id',
              operationId: 'get_fake_data',
              produces: ['application/json'],
              parameters: [
                {
                  $ref: '#/parameters/Authorization'
                },
                {
                  $ref: '#/parameters/Project.Id'
                },
                {
                  name: 'id',
                  in: 'path',
                  type: 'string',
                  required: true,
                  description: 'something'
                }
              ]
            }
          }
        },
        parameters: {
          Authorization: {
            name: 'Authorization',
            in: 'header',
            description: 'Identity Access Management (IAM) bearer token.',
            required: true,
            type: 'string',
            default: 'Bearer <token>'
          },
          'Project.Id': {
            name: 'project_id',
            in: 'query',
            description: 'The ID of the project to use.',
            required: true,
            type: 'string'
          },
          XOpenIDToken: {
            name: 'X-OpenID-Connect-ID-Token',
            in: 'header',
            description: 'UAA token.',
            required: true,
            type: 'string',
            default: '<token>'
          }
        }
      };

      const resolvedSpec = await resolver.dereference(spec);

      const res = validate({ resolvedSpec }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(0);
    });
  });

  describe('OpenAPI 3', function() {
    it('should complain about a $ref in an operation', function() {
      const jsSpec = {
        paths: {
          '/resource': {
            post: {
              $ref: 'external.yaml#/some-post'
            }
          }
        }
      };

      const resolvedSpec = {
        paths: {
          '/resource': {
            post: {
              description: 'illegally referenced operation',
              operationId: 'create_resource',
              summary: 'simple operation'
            }
          }
        }
      };

      const res = validate({ jsSpec, resolvedSpec, isOAS3: true }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.warnings.length).toEqual(0);

      expect(res.errors[0].path).toEqual('paths./resource.post.$ref');
      expect(res.errors[0].message).toEqual('$ref found in illegal location');
    });
  });
});
