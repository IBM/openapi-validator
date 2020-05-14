const expect = require('expect');
const yaml = require('js-yaml');
const fs = require('fs');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/schema-ibm');
const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - schema-ibm - Swagger 2', () => {
  it('should return an error when a property does not use a well defined property type', () => {
    const spec = {
      definitions: {
        WordStyle: {
          type: 'object',
          description: 'word style',
          properties: {
            level: {
              type: 'number',
              format: 'integer',
              description: 'Good to have a description'
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'definitions',
      'WordStyle',
      'properties',
      'level',
      'type'
    ]);
    expect(res.errors[0].message).toEqual(
      'Schema of type number should use one of the following formats: float, double.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should return an error when a property does not use a well defined property type', () => {
    const spec = {
      definitions: {
        WordStyle: {
          type: 'number',
          format: 'integer',
          description: 'word style'
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(['definitions', 'WordStyle', 'type']);
    expect(res.errors[0].message).toEqual(
      'Schema of type number should use one of the following formats: float, double.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it("should return an error when an array property's items does not use a well defined property type", () => {
    const spec = {
      definitions: {
        Thing: {
          type: 'object',
          description: 'thing',
          properties: {
            level: {
              type: 'array',
              description: 'has some items',
              items: {
                type: 'number',
                format: 'integer'
              }
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'definitions',
      'Thing',
      'properties',
      'level',
      'items',
      'type'
    ]);
    expect(res.errors[0].message).toEqual(
      'Schema of type number should use one of the following formats: float, double.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it("should not error when an array property's items is a ref", () => {
    const spec = {
      definitions: {
        Thing: {
          type: 'object',
          description: 'thing',
          properties: {
            level: {
              type: 'array',
              description: 'has one item, its a ref',
              items: {
                $ref: '#/definitions/levelItem'
              }
            }
          }
        },
        levelItem: {
          type: 'string',
          description: 'level item'
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should return an error when a response does not use a well defined property type', () => {
    const spec = {
      responses: {
        Thing: {
          schema: {
            properties: {
              level: {
                type: 'number',
                format: 'integer',
                description: 'i need better types'
              }
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'responses',
      'Thing',
      'schema',
      'properties',
      'level',
      'type'
    ]);
    expect(res.errors[0].message).toEqual(
      'Schema of type number should use one of the following formats: float, double.'
    );
    expect(res.warnings.length).toEqual(0);
  });

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

  it('should report file as a valid type for swagger2 when an invalid type is provided', () => {
    const spec = {
      definitions: {
        SomeSchema: {
          type: 'invalid_type'
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].message).toEqual(
      'Invalid type. Valid types are: integer, number, string, boolean, object, array, file.'
    );
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

  it('should return a warning when a property name is not snake case', () => {
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
            thingString: {
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
      'thingString'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Property names must be lower snake case.'
    );
  });

  it('should return a warning when an items property name is not snake case', () => {
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
            thing: {
              type: 'array',
              description: 'thing array',
              items: {
                type: 'object',
                properties: {
                  thingString: {
                    type: 'string',
                    description: 'thing string'
                  }
                }
              }
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
      'thing',
      'items',
      'properties',
      'thingString'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Property names must be lower snake case.'
    );
  });

  // tests for explicit property case convention
  it('should return a warning when a property name does not follow property_case_convention[1]=lower_snake_case', () => {
    const customConfig = {
      schemas: {
        snake_case_only: 'off',
        property_case_convention: ['warning', 'lower_snake_case']
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
      'thingString'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Property names must follow case convention: lower_snake_case'
    );
  });

  it('should return a warning when a property name does not follow property_case_convention[1]=lower_snake_case', () => {
    const customConfig = {
      schemas: {
        snake_case_only: 'off',
        property_case_convention: ['warning', 'lower_snake_case']
      }
    };

    const spec = {
      definitions: {
        Thing: {
          type: 'object',
          description: 'thing',
          properties: {
            thing: {
              type: 'array',
              description: 'thing array',
              items: {
                type: 'object',
                properties: {
                  thingString: {
                    type: 'string',
                    description: 'thing string'
                  }
                }
              }
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
      'thing',
      'items',
      'properties',
      'thingString'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Property names must follow case convention: lower_snake_case'
    );
  });

  it('should return no warnings when a property does follow property_case_convention[1]=lower_snake_case', () => {
    const customConfig = {
      schemas: {
        snake_case_only: 'off',
        property_case_convention: ['warning', 'lower_snake_case']
      }
    };

    const spec = {
      definitions: {
        Thing: {
          type: 'object',
          description: 'thing',
          properties: {
            thing: {
              type: 'array',
              description: 'thing array',
              items: {
                type: 'object',
                properties: {
                  thing_string: {
                    type: 'string',
                    description: 'thing string'
                  }
                }
              }
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, customConfig);
    expect(res.errors.length).toEqual(0);
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

  it('should return an error when a schema has no description', () => {
    const spec = {
      definitions: {
        Pet: {
          required: ['id', 'name'],
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              description: 'string'
            },
            name: {
              type: 'string',
              description: 'string'
            },
            tag: {
              type: 'string',
              description: 'string'
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual(['definitions', 'Pet']);
    expect(res.warnings[0].message).toEqual(
      'Schema must have a non-empty description.'
    );
  });

  it('should return an error when a schema property has no description', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                name: 'good_name',
                in: 'body',
                description: 'Not a bad description',
                schema: {
                  type: 'object',
                  properties: {
                    bad_property: {
                      type: 'string'
                    }
                  }
                }
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'parameters',
      '0',
      'schema',
      'properties',
      'bad_property',
      'description'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Schema properties must have a description with content in it.'
    );
  });

  it('should return an error when JSON is in the description', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                name: 'good_name',
                in: 'body',
                description: 'Not a bad description',
                schema: {
                  type: 'object',
                  properties: {
                    any_object: {
                      type: 'object',
                      description: 'it is not always a JSON object'
                    }
                  }
                }
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'parameters',
      '0',
      'schema',
      'properties',
      'any_object',
      'description'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Not all languages use JSON, so descriptions should not state that the model is a JSON object.'
    );
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

  it('should not return an error when JSON is in the description of a vendor extension', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                name: 'good_name',
                in: 'body',
                description: 'Not a bad description',
                schema: {
                  type: 'object',
                  properties: {
                    'x-vendor-anyObject': {
                      type: 'object',
                      description: 'it is not always a JSON object'
                    }
                  }
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

  it('should return a warning when a schema property is an array of arrays', () => {
    const spec = {
      definitions: {
        Thing: {
          type: 'object',
          description: 'thing',
          properties: {
            level: {
              type: 'array',
              description: 'has some items',
              items: {
                type: 'array',
                description: 'array nested in an array'
              }
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual([
      'definitions',
      'Thing',
      'properties',
      'level',
      'items',
      'type'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Array properties should avoid having items of type array.'
    );
  });
});

describe('validation plugin - semantic - schema-ibm - OpenAPI 3', () => {
  it('should return an error when an OASv3 schema has no description', () => {
    const spec = {
      components: {
        schemas: {
          Pet: {
            required: ['id', 'name'],
            properties: {
              id: {
                type: 'integer',
                format: 'int64',
                description: 'string'
              },
              name: {
                type: 'string',
                description: 'string'
              },
              tag: {
                type: 'string',
                description: 'string'
              }
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(1);
    expect(res.warnings[0].path).toEqual(['components', 'schemas', 'Pet']);
    expect(res.warnings[0].message).toEqual(
      'Schema must have a non-empty description.'
    );
  });

  it('should return an error when a complex parameter schema does not use a well defined property type', () => {
    const spec = {
      components: {
        parameters: {
          TestParam: {
            in: 'query',
            name: 'bad_param',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    bad_prop: {
                      description: 'property with bad format',
                      type: 'integer',
                      format: 'wrong'
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
      'components',
      'parameters',
      'TestParam',
      'content',
      'application/json',
      'schema',
      'properties',
      'bad_prop',
      'type'
    ]);
    expect(res.errors[0].message).toEqual(
      'Schema of type integer should use one of the following formats: int32, int64.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should record an error when items use an invalid type+format pair', () => {
    const spec = {
      components: {
        schemas: {
          Thing: {
            type: 'object',
            description: 'thing',
            properties: {
              thing: {
                type: 'array',
                description: 'thing array',
                items: {
                  description: 'invalid items',
                  type: 'object',
                  format: 'objects_should_not_have_formats'
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
      'components',
      'schemas',
      'Thing',
      'properties',
      'thing',
      'items',
      'type'
    ]);
    expect(res.errors[0].message).toEqual(
      'Schema of type object should not have a format.'
    );
  });

  it('should not record an error when items and object properties use valid type+format pairs', () => {
    const spec = {
      components: {
        schemas: {
          Thing1: {
            type: 'object',
            description: 'thing',
            properties: {
              prop1: {
                description: 'an object property',
                type: 'string',
                format: 'byte'
              }
            }
          },
          Thing2: {
            type: 'array',
            description: 'an array',
            items: {
              type: 'number',
              format: 'float'
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
    expect(res.errors.length).toEqual(0);
  });

  it('should record an error when objects use an invalid type+format pair', () => {
    const spec = {
      components: {
        schemas: {
          Thing: {
            type: 'object',
            description: 'thing',
            properties: {
              thing: {
                type: 'object',
                description: 'thing object',
                properties: {
                  prop1: {
                    description: 'a property',
                    type: 'array',
                    format: 'arrays_should_not_have_formats',
                    items: {
                      type: 'invalid_type'
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
    expect(res.errors.length).toEqual(2);
    expect(res.errors[0].path).toEqual([
      'components',
      'schemas',
      'Thing',
      'properties',
      'thing',
      'properties',
      'prop1',
      'type'
    ]);
    expect(res.errors[0].message).toEqual(
      'Schema of type array should not have a format.'
    );
    expect(res.errors[1].path).toEqual([
      'components',
      'schemas',
      'Thing',
      'properties',
      'thing',
      'properties',
      'prop1',
      'items',
      'type'
    ]);
    expect(res.errors[1].message).toEqual(
      'Invalid type. Valid types are: integer, number, string, boolean, object, array.'
    );
  });

  it('should record an error when schema has a format but no type', () => {
    const spec = {
      components: {
        schemas: {
          Thing: {
            type: 'object',
            description: 'thing',
            properties: {
              thing: {
                description: 'should not have format without type',
                format: 'byte'
              }
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].message).toEqual('Format defined without a type.');
  });

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

  it('should not validate an example when it contains the resemblence of a problem', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        prop: {
                          description: 'boolean types should not have formats',
                          type: 'boolean',
                          format: 'boolean'
                        }
                      }
                    },
                    example: {
                      schema: {
                        type: 'object',
                        properties: {
                          prop: {
                            type: 'boolean',
                            format: 'boolean'
                          }
                        }
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
      'properties',
      'prop',
      'type'
    ]);
    expect(res.errors[0].message).toEqual(
      'Schema of type boolean should not have a format.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should process allOf, oneOf, anyOf schemas correctly', () => {
    const spec = yaml.safeLoad(
      fs.readFileSync('test/cli-validator/mockFiles/oas3/testoneof.yaml')
    );

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
    expect(res.errors.length).toEqual(2);
    expect(res.errors[0].message).toEqual(
      'Invalid type. Valid types are: integer, number, string, boolean, object, array.'
    );
    expect(res.errors[1].message).toEqual(
      'Schema of type string should use one of the following formats: byte, binary, date, date-time, password.'
    );
  });

  it('should report an error when allOf, anyOf, or oneOf is not an array', () => {
    const spec = yaml.safeLoad(
      fs.readFileSync(
        'test/cli-validator/mockFiles/oas3/test-compose-model.yaml'
      )
    );

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
    expect(res.errors.length).toEqual(3);
    expect(res.errors[0].message).toEqual('oneOf value should be an array');
    expect(res.errors[0].path).toEqual([
      'components',
      'schemas',
      'oneOfError',
      'oneOf'
    ]);
    expect(res.errors[1].message).toEqual('allOf value should be an array');
    expect(res.errors[1].path).toEqual([
      'components',
      'schemas',
      'allOfError',
      'allOf'
    ]);
    expect(res.errors[2].message).toEqual('anyOf value should be an array');
    expect(res.errors[2].path).toEqual([
      'components',
      'schemas',
      'anyOfError',
      'anyOf'
    ]);
  });

  it('should report an error when allOf, anyOf, or oneOf is not an array with complex hierarchies', () => {
    const spec = yaml.safeLoad(
      fs.readFileSync(
        'test/cli-validator/mockFiles/oas3/complex-test-compose-model.yaml'
      )
    );

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
    expect(res.errors.length).toEqual(3);
    expect(res.errors[0].message).toEqual('oneOf value should be an array');
    expect(res.errors[0].path).toEqual([
      'components',
      'schemas',
      'complexOneOfError',
      'oneOf',
      0,
      'oneOf'
    ]);
    expect(res.errors[1].message).toEqual('allOf value should be an array');
    expect(res.errors[1].path).toEqual([
      'components',
      'schemas',
      'complexAllOfError',
      'oneOf',
      0,
      'allOf'
    ]);
    expect(res.errors[2].message).toEqual('anyOf value should be an array');
    expect(res.errors[2].path).toEqual([
      'components',
      'schemas',
      'complexAnyOfError',
      'oneOf',
      0,
      'anyOf'
    ]);
  });

  it('should report an error when non-array allOf, anyOf, or oneOf schema used in object prop', () => {
    const spec = yaml.safeLoad(
      fs.readFileSync(
        'test/cli-validator/mockFiles/oas3/compose-model-props.yaml'
      )
    );

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
    expect(res.errors.length).toEqual(3);
    expect(res.errors[0].message).toEqual('oneOf value should be an array');
    expect(res.errors[0].path).toEqual([
      'components',
      'schemas',
      'object1',
      'properties',
      'one_of_error_prop',
      'schema',
      'oneOf'
    ]);
    expect(res.errors[1].message).toEqual('allOf value should be an array');
    expect(res.errors[1].path).toEqual([
      'components',
      'schemas',
      'object1',
      'properties',
      'all_of_error_prop',
      'schema',
      'allOf'
    ]);
    expect(res.errors[2].message).toEqual('anyOf value should be an array');
    expect(res.errors[2].path).toEqual([
      'components',
      'schemas',
      'object1',
      'properties',
      'any_of_error_prop',
      'schema',
      'anyOf'
    ]);
  });

  it('should report an error when non-array allOf, anyOf, or oneOf schema used as items schema in array', () => {
    const spec = yaml.safeLoad(
      fs.readFileSync(
        'test/cli-validator/mockFiles/oas3/compose-model-items.yaml'
      )
    );

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
    expect(res.errors.length).toEqual(3);
    expect(res.errors[0].message).toEqual('oneOf value should be an array');
    expect(res.errors[0].path).toEqual([
      'components',
      'schemas',
      'one_of_array',
      'items',
      'oneOf'
    ]);
    expect(res.errors[1].message).toEqual('allOf value should be an array');
    expect(res.errors[1].path).toEqual([
      'components',
      'schemas',
      'all_of_array',
      'items',
      'allOf'
    ]);
    expect(res.errors[2].message).toEqual('anyOf value should be an array');
    expect(res.errors[2].path).toEqual([
      'components',
      'schemas',
      'any_of_array',
      'items',
      'anyOf'
    ]);
  });

  it('should not report an error when allOf, anyOf, or oneOf schema is an array', () => {
    const spec = yaml.safeLoad(
      fs.readFileSync(
        'test/cli-validator/mockFiles/oas3/compose-models-use-array.yaml'
      )
    );

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
    expect(res.errors.length).toEqual(0);
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
});
