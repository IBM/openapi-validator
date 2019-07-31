const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/pagination-ibm');

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
                  }
                }
              }
            }
          }
        };

        const res = validate({ jsSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(3);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].message).toEqual(
          'limit must be of type integer and must be optional with default and maximum values'
        );
        expect(res.warnings[1].message).toEqual(
          'if start is not defined then offset must be defined and must be of type integer and optional'
        );
        expect(res.warnings[2].message).toEqual(
          'if a limit exists as a parameter query it must be defined as a property'
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
                    maximum: 100,
                    default: 50,
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

        const res = validate({ jsSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(1);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].message).toEqual(
          'if start or token or cursor are  defined then responses must have a `next_token` or `next_cursor` property'
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
                      type: 'integer'
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
        expect(res.warnings.length).toEqual(2);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].message).toEqual(
          'limit must be of type integer and must be optional with default and maximum values'
        );
        expect(res.warnings[1].message).toEqual(
          'if a limit exists as a parameter query it must be defined as a property'
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
                      type: 'integer'
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

        const res = validate({ jsSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(2);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].message).toEqual(
          'if a offset exists as a parameter query it must be defined as a property'
        );
        expect(res.warnings[1].message).toEqual(
          'if start or token or cursor are  defined then responses must have a `next_token` or `next_cursor` property'
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

        const res = validate({ jsSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(1);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].message).toEqual(
          'if start is not defined then offset must be defined and must be of type integer and optional'
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
        };

        const res = validate({ jsSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(1);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].message).toEqual(
          'a paginated success response must contain the next property'
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
        };

        const res = validate({ jsSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(1);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].message).toEqual(
          'if a limit exists as a parameter query it must be defined as a property'
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
        };

        const res = validate({ jsSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(1);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].message).toEqual(
          'if a offset exists as a parameter query it must be defined as a property'
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
        };

        const res = validate({ jsSpec: spec, isOAS3: true }, config);
        expect(res.warnings.length).toEqual(1);
        expect(res.errors.length).toEqual(0);
        expect(res.warnings[0].message).toEqual(
          'if start or token or cursor are  defined then responses must have a `next_token` or `next_cursor` property'
        );
      });
    });
  });
});
