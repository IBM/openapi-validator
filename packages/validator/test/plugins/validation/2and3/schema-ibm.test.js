const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/schema-ibm');
const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - schema-ibm - Swagger 2', () => {
  it('should non return an error for a response schema of type file', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            responses: {
              '200': {
                description: 'legal response',
                schema: {
                  type: 'file'
                }
              }
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should record an error when a file parameter does not use in: formData', () => {
    const spec = {
      paths: {
        '/some/path/{id}': {
          get: {
            parameters: [
              {
                name: 'file_param',
                in: 'query',
                description: 'a file param',
                type: 'file'
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: false }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].message).toEqual(
      'File type parameter must use in: formData.'
    );
  });

  it('should record an error when a file parameter does not use in: formData AND if format defined', () => {
    const spec = {
      paths: {
        '/some/path/{id}': {
          get: {
            parameters: [
              {
                name: 'file_param',
                in: 'query',
                description: 'a file param',
                type: 'file',
                format: 'file_should_not_have_a_format'
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: false }, config);
    expect(res.errors.length).toEqual(2);
    expect(res.errors[0].message).toEqual(
      'File type parameter must use in: formData.'
    );
    expect(res.errors[1].message).toEqual(
      'Schema of type file should not have a format.'
    );
  });

  it('should not record an error when a file parameter uses in: formData', () => {
    const spec = {
      paths: {
        '/some/path/{id}': {
          get: {
            parameters: [
              {
                name: 'file_param',
                in: 'formData',
                description: 'a file param',
                type: 'file'
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: false }, config);
    expect(res.errors.length).toEqual(0);
  });

  it('should non return an error for a definition with root type of file', () => {
    const spec = {
      definitions: {
        SomeSchema: {
          type: 'file',
          description: 'file schema, used for parameter or response'
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should return an error for a response schema with non-root type file', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            responses: {
              '200': {
                description: 'legal response',
                schema: {
                  properties: {
                    this_is_bad: {
                      type: 'file',
                      description: 'non-root type of file is bad'
                    }
                  }
                }
              }
            }
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
      'responses',
      '200',
      'schema',
      'properties',
      'this_is_bad',
      'type'
    ]);
    expect(res.errors[0].message).toEqual(
      'File type only valid for swagger2 and must be used as root schema.'
    );

    expect(res.warnings.length).toEqual(0);
  });

  it('should not return a case_convention error when property is deprecated', () => {
    const spec = {
      definitions: {
        Thing: {
          type: 'object',
          description: 'thing',
          properties: {
            thingName: {
              type: 'string',
              description: 'thing name',
              deprecated: true
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should not die when a schema contains a description property', () => {
    const spec = {
      definitions: {
        Notice: {
          type: 'object',
          description: 'A notice produced for the collection',
          properties: {
            notice_id: {
              type: 'string',
              readOnly: true,
              description:
                'Identifies the notice. Many notices may have the same ID. This field exists so that user applications can programmatically identify a notice and take automatic corrective action.'
            },
            description: {
              type: 'string',
              readOnly: true,
              description: 'The description of the notice'
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });
});

describe('validation plugin - semantic - schema-ibm - OpenAPI 3', () => {
  it('should return an error for a response schema of type file', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
                      type: 'file'
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'responses',
      '200',
      'content',
      'application/json',
      'schema',
      'type'
    ]);
    expect(res.errors[0].message).toEqual(
      'File type only valid for swagger2 and must be used as root schema.'
    );
    expect(res.warnings.length).toEqual(0);
  });
});
