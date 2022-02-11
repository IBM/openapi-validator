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

  // tests for explicit name collisions
  it('should return a warning when two property names of different case conventions are identical if converted to a single case', () => {
    const customConfig = {
      schemas: {
        snake_case_only: 'off',
        property_case_collision: 'warning'
      }
    };

    const spec = {
      definitions: {
        Thing: {
          type: 'object',
          description: 'thing',
          properties: {
            thingString: {
              type: 'string',
              description: 'thing string'
            },
            thing_string: {
              type: 'string',
              description: 'thing string'
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, customConfig);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'definitions',
      'Thing',
      'properties',
      'thing_string'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Property name is identical to another property except for the naming convention: thing_string'
    );
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

  it('should return a warning when an enum value is not snake case', () => {
    const customConfig = {
      schemas: {
        snake_case_only: 'warning'
      }
    };

    const spec = {
      definitions: {
        Thing: {
          type: 'object',
          description: 'thing',
          properties: {
            color: {
              type: 'string',
              description: 'some color',
              enum: ['blue', 'light_blue', 'darkBlue']
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, customConfig);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'definitions',
      'Thing',
      'properties',
      'color',
      'enum',
      '2'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Enum values must be lower snake case.'
    );
  });

  it('should return a warning when an enum value is not snake case', () => {
    const customConfig = {
      schemas: {
        snake_case_only: 'warning'
      }
    };

    const spec = {
      paths: {
        '/some/path/{id}': {
          get: {
            parameters: [
              {
                name: 'enum_param',
                in: 'query',
                description: 'an enum param',
                type: 'array',
                required: 'true',
                items: {
                  type: 'string',
                  description: 'the values',
                  enum: ['all', 'enumValues', 'possible']
                }
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, customConfig);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/some/path/{id}',
      'get',
      'parameters',
      '0',
      'items',
      'enum',
      '1'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Enum values must be lower snake case.'
    );
  });

  it('should return a warning when an enum value is not snake case', () => {
    const customConfig = {
      schemas: {
        snake_case_only: 'warning'
      }
    };

    const spec = {
      definitions: {
        Thing: {
          type: 'object',
          description: 'thing',
          properties: {
            color: {
              type: 'string',
              description: 'some color',
              enum: ['blue', 'light_blue', 'darkBlue']
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, customConfig);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'definitions',
      'Thing',
      'properties',
      'color',
      'enum',
      '2'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Enum values must be lower snake case.'
    );
  });

  it('should return a warning when an enum value is not snake case', () => {
    const customConfig = {
      schemas: {
        snake_case_only: 'warning'
      }
    };

    const spec = {
      paths: {
        '/some/path/{id}': {
          get: {
            parameters: [
              {
                name: 'enum_param',
                in: 'query',
                description: 'an enum param',
                type: 'array',
                required: 'true',
                items: {
                  type: 'string',
                  description: 'the values',
                  enum: ['all', 'enumValues', 'possible']
                }
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, customConfig);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/some/path/{id}',
      'get',
      'parameters',
      '0',
      'items',
      'enum',
      '1'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Enum values must be lower snake case.'
    );
  });

  // Tests for explicit enum_case_convention
  it('should return a warning when an enum value does not follow enum_case_convention[1]=lower_snake_case', () => {
    const customConfig = {
      schemas: {
        snake_case_only: 'off',
        enum_case_convention: ['warning', 'lower_snake_case']
      }
    };

    const spec = {
      definitions: {
        Thing: {
          type: 'object',
          description: 'thing',
          properties: {
            color: {
              type: 'string',
              description: 'some color',
              enum: ['blue', 'light_blue', 'darkBlue']
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, customConfig);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'definitions',
      'Thing',
      'properties',
      'color',
      'enum',
      '2'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Enum values must follow case convention: lower_snake_case'
    );
  });

  it('should return a warning when an enum value does not follow enum_case_convention[1]=lower_snake_case', () => {
    const customConfig = {
      schemas: {
        snake_case_only: 'off',
        enum_case_convention: ['warning', 'lower_snake_case']
      }
    };

    const spec = {
      paths: {
        '/some/path/{id}': {
          get: {
            parameters: [
              {
                name: 'enum_param',
                in: 'query',
                description: 'an enum param',
                type: 'array',
                required: 'true',
                items: {
                  type: 'string',
                  description: 'the values',
                  enum: ['all', 'enumValues', 'possible']
                }
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, customConfig);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/some/path/{id}',
      'get',
      'parameters',
      '0',
      'items',
      'enum',
      '1'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Enum values must follow case convention: lower_snake_case'
    );
  });

  it('should return a warning when an enum value does not follow enum_case_convention[1]=lower_snake_case', () => {
    const customConfig = {
      schemas: {
        snake_case_only: 'off',
        enum_case_convention: ['warning', 'lower_snake_case']
      }
    };

    const spec = {
      definitions: {
        Thing: {
          type: 'object',
          description: 'thing',
          properties: {
            color: {
              type: 'string',
              description: 'some color',
              enum: ['blue', 'light_blue', 'darkBlue']
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, customConfig);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'definitions',
      'Thing',
      'properties',
      'color',
      'enum',
      '2'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Enum values must follow case convention: lower_snake_case'
    );
  });

  it('should return a warning when an enum value does not follow enum_case_convention[1]=lower_snake_case', () => {
    const customConfig = {
      schemas: {
        snake_case_only: 'off',
        enum_case_convention: ['warning', 'lower_snake_case']
      }
    };

    const spec = {
      paths: {
        '/some/path/{id}': {
          get: {
            parameters: [
              {
                name: 'enum_param',
                in: 'query',
                description: 'an enum param',
                type: 'array',
                required: 'true',
                items: {
                  type: 'string',
                  description: 'the values',
                  enum: ['all', 'enumValues', 'possible']
                }
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, customConfig);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/some/path/{id}',
      'get',
      'parameters',
      '0',
      'items',
      'enum',
      '1'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Enum values must follow case convention: lower_snake_case'
    );
  });

  it('should skip validation for non string values', () => {
    const customConfig = {
      schemas: {
        snake_case_only: 'warning'
      }
    };

    const spec = {
      definitions: {
        Thing: {
          type: 'object',
          description: 'thing',
          properties: {
            integer: {
              type: 'integer',
              description: 'an integer',
              enum: [1, 2, 3]
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, customConfig);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should produce a warning for properties that have the same name but an inconsistent type', () => {
    const spec = {
      components: {
        schemas: {
          person: {
            description: 'Produce warnings',
            properties: {
              name: {
                description: 'type integer',
                type: 'integer'
              }
            }
          },
          adult: {
            description: 'Causes first warnings',
            properties: {
              name: {
                description: 'different type',
                type: 'number'
              }
            }
          },
          kid: {
            description: 'Causes second warning',
            properties: {
              name: {
                type: 'string',
                description: 'differnt type'
              }
            }
          }
        }
      }
    };

    const message = 'Property has inconsistent type: name.';
    const res = validate({ jsSpec: spec }, config);

    expect(res.warnings.length).toEqual(3);
    expect(res.errors.length).toEqual(0);

    expect(res.warnings[0].message).toEqual(message);
    expect(res.warnings[0].path).toEqual(
      'components.schemas.person.properties.name'
    );
    expect(res.warnings[1].message).toEqual(message);
    expect(res.warnings[1].path).toEqual(
      'components.schemas.adult.properties.name'
    );
    expect(res.warnings[2].message).toEqual(message);
    expect(res.warnings[2].path).toEqual(
      'components.schemas.kid.properties.name'
    );
  });

  it('should not produce a warning for properties with duplicate common names', () => {
    const spec = {
      components: {
        schemas: {
          person: {
            description: 'Produce warnings',
            properties: {
              name: {
                description: 'type integer',
                type: 'integer'
              }
            }
          },
          adult: {
            description: 'Causes first warnings',
            properties: {
              code: {
                description: 'different type',
                type: 'number'
              }
            }
          },
          kid: {
            description: 'Causes second warning',
            properties: {
              code: {
                type: 'string',
                description: 'differnt type'
              }
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);

    expect(res.warnings.length).toEqual(0);
    expect(res.errors.length).toEqual(0);
  });

  it('should not produce a warning for properties with duplicate custom names', () => {
    const customConfig = {
      schemas: {
        inconsistent_property_type: ['warning', ['year']]
      }
    };

    const spec = {
      components: {
        schemas: {
          person: {
            description: 'Produce warnings',
            properties: {
              year: {
                description: 'type integer',
                type: 'integer'
              }
            }
          },
          adult: {
            description: 'Causes first warnings',
            properties: {
              year: {
                description: 'different type',
                type: 'number'
              }
            }
          },
          kid: {
            description: 'Causes second warning',
            properties: {
              year: {
                type: 'string',
                description: 'differnt type'
              }
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, customConfig);

    expect(res.warnings.length).toEqual(0);
    expect(res.errors.length).toEqual(0);
  });
});
