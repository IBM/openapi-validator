const expect = require('expect');
const yaml = require('js-yaml');
const fs = require('fs');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/schema-ibm');

describe('validation plugin - semantic - schema-ibm - Swagger 2', () => {
  it('should return an error when a property does not use a well defined property type', () => {
    const config = {
      schemas: {
        invalid_type_format_pair: 'error'
      }
    };

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
      'Property type+format is not well-defined.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should return an error when a property does not use a well defined property type', () => {
    const config = {
      schemas: {
        invalid_type_format_pair: 'error'
      }
    };

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
      'Property type+format is not well-defined.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it("should return an error when an array property's items does not use a well defined property type", () => {
    const config = {
      schemas: {
        invalid_type_format_pair: 'error'
      }
    };

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
      'Property type+format is not well-defined.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it("should not error when an array property's items is a ref", () => {
    const config = {
      schemas: {
        invalid_type_format_pair: 'error'
      }
    };

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
    const config = {
      schemas: {
        invalid_type_format_pair: 'error'
      }
    };

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
      'Property type+format is not well-defined.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should non return an error for a response schema of type file', () => {
    const config = {
      schemas: {
        invalid_type_format_pair: 'error'
      }
    };

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

  it('should non return an error for a definition with root type of file', () => {
    const config = {
      schemas: {
        invalid_type_format_pair: 'error'
      }
    };

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
    const config = {
      schemas: {
        invalid_type_format_pair: 'error'
      }
    };

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
      'Property type+format is not well-defined.'
    );

    expect(res.warnings.length).toEqual(0);
  });

  it('should return a warning when a property name is not snake case', () => {
    const config = {
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

    const res = validate({ jsSpec: spec }, config);
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
    const config = {
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

    const res = validate({ jsSpec: spec }, config);
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
    const config = {
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

    const res = validate({ jsSpec: spec }, config);
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
    const config = {
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

    const res = validate({ jsSpec: spec }, config);
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
    const config = {
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

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should return an error when a schema has no description', () => {
    const config = {
      schemas: {
        no_schema_description: 'warning'
      }
    };

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
    const config = {
      schemas: {
        snake_case_only: 'off',
        no_property_description: 'warning'
      }
    };

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
                    badProperty: {
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
      'badProperty',
      'description'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Schema properties must have a description with content in it.'
    );
  });

  it('should return an error when JSON is in the description', () => {
    const config = {
      schemas: {
        description_mentions_json: 'warning'
      }
    };

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
                    anyObject: {
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
      'anyObject',
      'description'
    ]);
    expect(res.warnings[0].message).toEqual(
      'Not all languages use JSON, so descriptions should not state that the model is a JSON object.'
    );
  });

  it('should not die when a schema contains a description property', () => {
    const config = {
      schemas: {
        invalid_type_format_pair: 'error',
        no_property_description: 'warning',
        description_mentions_json: 'warning'
      }
    };

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
    const config = {
      schemas: {
        description_mentions_json: 'warning'
      }
    };

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
    const config = {
      schemas: {
        array_of_arrays: 'warning'
      }
    };

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
    const config = {
      schemas: {
        no_schema_description: 'warning'
      }
    };

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
    const config = {
      schemas: {
        invalid_type_format_pair: 'error'
      }
    };

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
                    BadProp: {
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
      'BadProp',
      'type'
    ]);
    expect(res.errors[0].message).toEqual(
      'Property type+format is not well-defined.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should return an error for a response schema of type file', () => {
    const config = {
      schemas: {
        invalid_type_format_pair: 'error'
      }
    };

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
      'Property type+format is not well-defined.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should not validate an example when it contains the resemblence of a problem', () => {
    const config = {
      schemas: {
        invalid_type_format_pair: 'error'
      }
    };

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
      'Property type+format is not well-defined.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should process allOf, oneOf, anyOf schemas correctly', () => {
    const config = {
      schemas: {
        invalid_type_format_pair: 'error'
      }
    };

    const spec = yaml.safeLoad(
      fs.readFileSync('test/cli-validator/mockFiles/oas3/testoneof.yaml')
    );

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
    expect(res.errors.length).toEqual(2);
    expect(res.errors[0].message).toEqual(
      'Property type+format is not well-defined.'
    );
    expect(res.errors[1].message).toEqual(
      'Property type+format is not well-defined.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should return a warning when an enum value is not snake case', () => {
    const config = {
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

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
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
    const config = {
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

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
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
    const config = {
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

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
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
    const config = {
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

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
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
    const config = {
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

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
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
    const config = {
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

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
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
    const config = {
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

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
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
    const config = {
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

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
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
    const config = {
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
            integers: {
              type: 'string',
              description: 'list of integers',
              enum: [1, 2, 3]
            }
          }
        }
      }
    };

    const res = validate({ jsSpec: spec, isOAS3: true }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });
});
