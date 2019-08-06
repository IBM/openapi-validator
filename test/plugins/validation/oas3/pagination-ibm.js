const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/oas3/semantic-validators/pagination-ibm');

const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - responses', function() {
  describe('inline response schemas', function() {
    describe('Pagination', function() {
      it('should complain when the paginated object does not have start, cursor, or token', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                parameters: [
                  {
                    name: 'limit',
                    in: 'query',
                    description: 'Limit on how many items should be returned.',
                    required: false,
                    schema: {
                      type: 'string'
                    }
                  },
                  {
                    name: 'name',
                    in: 'query',
                    description: 'The human-readable name of the alias.',
                    required: false,
                    schema: {
                      type: 'string'
                    }
                  }
                ],
                responses: {
                  '201': {
                    content: {
                      'application/json': {
                        description: 'successful operation',
                        schema: {
                          type: 'object',
                          properties: {
                            stuff: {
                              type: 'string'
                            }
                          }
                        }
                      }
                    }
                  },
                  '200': {
                    content: {
                      'application/json': {
                        schema: {
                          description: '',
                          type: 'object',
                          required: ['next_url', 'resources', 'rows_count'],
                          properties: {
                            next_url: {
                              description: '',
                              type: 'string'
                            },
                            resources: {
                              description: '',
                              type: 'array'
                            },
                            rows_count: {
                              description: '',
                              type: 'number'
                            }
                          }
                        }
                      }
                    }
                  },
                  '204': {
                    content: {
                      'application/json': {
                        description: 'successful operation',
                        schema: {
                          type: 'object',
                          properties: {
                            stuff: {
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
          }
        };

        const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(2);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/pets',
          'get',
          'parameters',
          0
        ]);
        expect(res.warnings[0].message).toEqual(
          'The limit parameter must be of type integer and must be optional with default and maximum values.'
        );
        expect(res.warnings[1].message).toEqual(
          'If a limit exists as a parameter query it must be defined as a property.'
        );
      });

      it('should complain when next_token and start are both missing', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                parameters: [
                  {
                    name: 'limit',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'integer'
                    }
                  },
                  {
                    name: 'name',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'string'
                    }
                  },
                  {
                    name: 'offset',
                    in: 'query',
                    description: '',
                    required: true,
                    schema: {
                      type: 'integer'
                    }
                  },
                  {
                    name: 'start',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'string'
                    }
                  }
                ],
                responses: {
                  '200': {
                    content: {
                      'application/json': {
                        schema: {
                          description: '',
                          type: 'object',
                          required: [
                            'next_url',
                            'resources',
                            'rows_count',
                            'limit',
                            'offset'
                          ],
                          properties: {
                            offset: {
                              description: '',
                              type: 'integer'
                            },
                            limit: {
                              description: '',
                              type: 'integer',
                              default: 20,
                              maximum: 50
                            },
                            next_url: {
                              description: '',
                              type: 'string'
                            },
                            resources: {
                              description: '',
                              type: 'array'
                            },
                            rows_count: {
                              description: '',
                              type: 'number'
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

        const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(2);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/pets',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'properties'
        ]);
        expect(res.warnings[0].message).toEqual(
          'The start or cursor properties must be integers and optional.'
        );
        expect(res.warnings[1].message).toEqual(
          'If start or token or cursor are  defined then responses must have a `next_token` or `next_cursor` property.'
        );
      });

      it('should complain when limit is misdefined', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                parameters: [
                  {
                    name: 'limit',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'integer'
                    }
                  },
                  {
                    name: 'name',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'string'
                    }
                  },
                  {
                    name: 'start',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'string'
                    }
                  },
                  {
                    name: 'offset',
                    in: 'query',
                    description: '',
                    required: true,
                    schema: {
                      type: 'integer'
                    }
                  }
                ],
                responses: {
                  '200': {
                    content: {
                      'application/json': {
                        schema: {
                          description: '',
                          type: 'object',
                          required: [
                            'next_url',
                            'resources',
                            'rows_count',
                            'limit',
                            'offset'
                          ],
                          properties: {
                            offset: {
                              description: '',
                              type: 'integer'
                            },
                            next_url: {
                              description: '',
                              type: 'string'
                            },
                            resources: {
                              description: '',
                              type: 'array'
                            },
                            rows_count: {
                              description: '',
                              type: 'number'
                            },
                            next_token: {
                              description: '',
                              type: 'string'
                            },
                            limit: {
                              description: '',
                              type: 'string',
                              default: 20,
                              maximum: 50
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

        const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(2);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/pets',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'properties'
        ]);
        expect(res.warnings[0].message).toEqual(
          'The start or cursor properties must be integers and optional.'
        );
        expect(res.warnings[1].message).toEqual(
          'If a limit exists as a parameter query it must be defined as a property.'
        );
      });

      it('should complain when offset is misdefined', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                parameters: [
                  {
                    name: 'limit',
                    in: 'query',
                    description: '',
                    maximum: 100,
                    default: 20,
                    required: false,
                    schema: {
                      type: 'integer'
                    }
                  },
                  {
                    name: 'name',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'string'
                    }
                  },
                  {
                    name: 'start',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'string'
                    }
                  },
                  {
                    name: 'offset',
                    in: 'query',
                    description: 'shifts results',
                    required: true,
                    schema: {
                      type: 'integer'
                    }
                  }
                ],
                responses: {
                  '200': {
                    content: {
                      'application/json': {
                        schema: {
                          description: '',
                          type: 'object',
                          required: [
                            'next_url',
                            'resources',
                            'rows_count',
                            'limit'
                          ],
                          properties: {
                            limit: {
                              description: '',
                              type: 'integer'
                            },
                            next_url: {
                              description: '',
                              type: 'string'
                            },
                            resources: {
                              description: '',
                              type: 'array'
                            },
                            rows_count: {
                              description: '',
                              type: 'number'
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

        const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(4);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/pets',
          'get',
          'parameters',
          0
        ]);
        expect(res.warnings[0].message).toEqual(
          'The limit parameter must be of type integer and must be optional with default and maximum values.'
        );
        expect(res.warnings[1].message).toEqual(
          'The start or cursor properties must be integers and optional.'
        );
        expect(res.warnings[2].message).toEqual(
          'If a offset exists as a parameter query it must be defined as a property.'
        );
        expect(res.warnings[3].message).toEqual(
          'If start or token or cursor are  defined then responses must have a `next_token` or `next_cursor` property.'
        );
      });

      it('should complain when offset and start are both undefined', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                parameters: [
                  {
                    name: 'limit',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'integer'
                    }
                  },
                  {
                    name: 'name',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'string'
                    }
                  }
                ],
                responses: {
                  '200': {
                    content: {
                      'application/json': {
                        schema: {
                          description: 'A list of resource aliases.',
                          type: 'object',
                          required: [
                            'next_url',
                            'resources',
                            'rows_count',
                            'limit'
                          ],
                          properties: {
                            limit: {
                              description: '',
                              type: 'integer'
                            },
                            next_url: {
                              description: '',
                              type: 'string'
                            },
                            resources: {
                              description: '',
                              type: 'array'
                            },
                            rows_count: {
                              description: '',
                              type: 'number'
                            },

                            next_token: {}
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

        const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(1);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/pets',
          'get',
          'parameters',
          0
        ]);
        expect(res.warnings[0].message).toEqual(
          'The limit parameter must be of type integer and must be optional with default and maximum values.'
        );
      });
    });

    describe('pagination with pagination object', function() {
      it('should complain when a paginated object doesnt contain the next_url property', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                parameters: [
                  {
                    name: 'limit',
                    in: 'query',
                    description: 'Limit on how many items should be returned.',
                    maximum: 100,
                    default: 20,
                    required: false,
                    schema: {
                      type: 'integer'
                    }
                  },
                  {
                    name: 'name',
                    in: 'query',
                    description: 'The human-readable name of the alias.',
                    required: false,
                    schema: {
                      type: 'string'
                    }
                  }
                ],
                responses: {
                  '200': {
                    content: {
                      'application/json': {
                        schema: {
                          properties: {
                            pagination: {
                              description: '',
                              type: 'object',
                              required: ['resources', 'rows_count', 'limit'],
                              properties: {
                                limit: {
                                  description: '',
                                  type: 'integer'
                                },
                                resources: {
                                  description: '',
                                  type: 'array'
                                },
                                rows_count: {
                                  description: '',
                                  type: 'number'
                                },
                                next_token: {}
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

        const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(1);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/pets',
          'get',
          'reponses',
          '200',
          'content',
          'application/json',
          'pagination',
          'schema',
          'properties'
        ]);
        expect(res.warnings[0].message).toEqual(
          'A paginated success response must contain the next property.'
        );
      });

      it('should complain when a paginaed object defined limit as a query parameter but not a response property', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                parameters: [
                  {
                    name: 'limit',
                    in: 'query',
                    description: '',
                    maximum: 100,
                    default: 20,
                    required: false,
                    schema: {
                      type: 'integer'
                    }
                  },
                  {
                    name: 'name',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'string'
                    }
                  }
                ],
                responses: {
                  '200': {
                    content: {
                      'application/json': {
                        schema: {
                          properties: {
                            pagination: {
                              description: '',
                              type: 'object',
                              required: ['resources', 'rows_count', 'limit'],
                              properties: {
                                resources: {
                                  description: '',
                                  type: 'array'
                                },
                                rows_count: {
                                  description: '',
                                  type: 'number'
                                },
                                next_url: {
                                  description: '',
                                  type: 'string'
                                },
                                next_token: {}
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

        const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(1);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/pets',
          'get',
          'reponses',
          '200',
          'content',
          'application/json',
          'pagination',
          'schema',
          'properties'
        ]);
        expect(res.warnings[0].message).toEqual(
          'If a limit exists as a parameter query it must be defined as a property.'
        );
      });

      it('should complain when a paginated object defines offset as a query parameter but not a response property', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                parameters: [
                  {
                    name: 'limit',
                    in: 'query',
                    description: '',
                    maximum: 100,
                    default: 20,
                    required: false,
                    schema: {
                      type: 'integer'
                    }
                  },
                  {
                    name: 'name',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'string'
                    }
                  },
                  {
                    name: 'offset',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'integer'
                    }
                  }
                ],
                responses: {
                  '200': {
                    content: {
                      'application/json': {
                        schema: {
                          properties: {
                            pagination: {
                              description: '',
                              type: 'object',
                              required: ['resources', 'rows_count', 'limit'],
                              properties: {
                                limit: {
                                  description: '',
                                  type: 'integer'
                                },
                                resources: {
                                  description: '',
                                  type: 'array'
                                },
                                rows_count: {
                                  description: '',
                                  type: 'number'
                                },
                                next_url: {
                                  description: '',
                                  type: 'string'
                                },
                                next_token: {}
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

        const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(1);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/pets',
          'get',
          'reponses',
          '200',
          'content',
          'application/json',
          'pagination',
          'schema',
          'properties'
        ]);
        expect(res.warnings[0].message).toEqual(
          'If a offset exists as a parameter query it must be defined as a property.'
        );
      });

      it('should complain when a paginated object misdefines total', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                parameters: [
                  {
                    name: 'limit',
                    in: 'query',
                    description: '',
                    maximum: 100,
                    default: 20,
                    required: false,
                    schema: {
                      type: 'integer'
                    }
                  },
                  {
                    name: 'name',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'string'
                    }
                  },
                  {
                    name: 'start',
                    in: 'query',
                    description: '',
                    required: false,
                    schema: {
                      type: 'integer'
                    }
                  }
                ],
                responses: {
                  '200': {
                    content: {
                      'application/json': {
                        schema: {
                          properties: {
                            pagination: {
                              description: 'A list of resource aliases.',
                              type: 'object',
                              required: ['resources', 'rows_count', 'limit'],
                              properties: {
                                limit: {
                                  description: '',
                                  type: 'integer'
                                },
                                resources: {
                                  description: '',
                                  type: 'array'
                                },
                                rows_count: {
                                  description: '',
                                  type: 'number'
                                },
                                next_url: {
                                  description:
                                    'The URL for requesting the next page of results.',
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
              }
            }
          }
        };

        const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(1);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].path).toEqual([
          'paths',
          '/pets',
          'get',
          'reponses',
          '200',
          'content',
          'application/json',
          'pagination',
          'schema',
          'properties'
        ]);
        expect(res.warnings[0].message).toEqual(
          'If start or token or cursor are  defined then responses must have a `next_token` or `next_cursor` property.'
        );
      });
    });
  });
});
