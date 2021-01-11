const expect = require('expect');
const resolver = require('json-schema-ref-parser');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/walker-ibm');
const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - walker-ibm', () => {
  it('should return an error when description is empty', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                name: 'tags',
                in: 'query',
                description: '',
                type: 'string'
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'parameters',
      '0',
      'description'
    ]);
    expect(res.errors[0].message).toEqual(
      'Items with a description must have content in it.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should return an error when description contains whitespace', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                name: 'tags',
                in: 'query',
                description: '   ',
                type: 'string'
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'parameters',
      '0',
      'description'
    ]);
    expect(res.errors[0].message).toEqual(
      'Items with a description must have content in it.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should not return an error when bad description is in extension', () => {
    const spec = {
      'x-vendor-paths': {
        '/pets': {
          get: {
            parameters: [
              {
                name: 'tags',
                in: 'query',
                description: '   ',
                type: 'string'
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

  it('should return an error when a non-default property contains a null value', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                name: 'tags',
                in: 'query',
                description: null,
                type: 'string'
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'parameters',
      '0',
      'description'
    ]);
    expect(res.errors[0].message).toEqual(
      'Null values are not allowed for any property.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should not return an error when the default property contains a null value', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                name: 'tags',
                in: 'query',
                default: null,
                type: 'string'
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

  it('should complain if a description sibling to a $ref matches the referenced schema description', async () => {
    const spec = {
      paths: {
        '/stuff': {
          get: {
            summary: 'list stuff',
            operationId: 'listStuff',
            produces: ['application/json'],
            responses: {
              200: {
                description: 'successful operation',
                schema: {
                  $ref: '#/responses/Success',
                  description: 'simple success response'
                }
              }
            }
          }
        }
      },
      responses: {
        Success: {
          type: 'string',
          description: 'simple success response'
        }
      }
    };

    // clone spec, otherwise 'dereference' will change the spec by reference
    const specCopy = JSON.parse(JSON.stringify(spec));
    const resolvedSpec = await resolver.dereference(specCopy);

    const res = validate({ jsSpec: spec, resolvedSpec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/stuff',
      'get',
      'responses',
      '200',
      'schema',
      'description'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Description sibling to $ref matches that of the referenced schema. This is redundant and should be removed.'
    );
  });

  it('should not crash in duplicate description test if path contains a period', async () => {
    const spec = {
      paths: {
        '/other.stuff': {
          get: {
            summary: 'list stuff',
            operationId: 'listStuff',
            produces: ['application/json'],
            responses: {
              200: {
                description: 'successful operation',
                schema: {
                  $ref: '#/responses/Success',
                  description: 'simple success response'
                }
              }
            }
          }
        }
      },
      responses: {
        Success: {
          type: 'string',
          description: 'simple success response'
        }
      }
    };

    // clone spec, otherwise 'dereference' will change the spec by reference
    const specCopy = JSON.parse(JSON.stringify(spec));
    const resolvedSpec = await resolver.dereference(specCopy);

    const res = validate({ jsSpec: spec, resolvedSpec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/other.stuff',
      'get',
      'responses',
      '200',
      'schema',
      'description'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Description sibling to $ref matches that of the referenced schema. This is redundant and should be removed.'
    );
  });
});
