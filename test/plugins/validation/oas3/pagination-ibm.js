const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/oas3/semantic-validators/pagination-ibm');

const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - pagaination - oas3', function() {
  describe('only check paginated list operations', function() {
    it('should skip operations that do not return an array', function() {
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
                  description: 'limit',
                  required: false,
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
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
                        required: ['resources', 'limit'],
                        properties: {
                          resource: {
                            description: 'resource',
                            type: 'object'
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
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
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(0);
    });

    it('should skip operations that do not have a limit query parameter', function() {
      const spec = {
        paths: {
          '/pets': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [],
              responses: {
                '200': {
                  content: {
                    'application/json': {
                      schema: {
                        description: '',
                        type: 'object',
                        required: ['resources', 'limit'],
                        properties: {
                          resource: {
                            description: 'resource',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
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
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(0);
    });

    it('should skip operations that do not have an application/json response', function() {
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
                  description: 'limit',
                  required: false,
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
                  }
                }
              ],
              responses: {
                '200': {
                  content: {
                    'application/octet-stream': {
                      schema: {
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
      };

      const res = validate({ resolvedSpec: spec, isOAS3: true }, config);
      expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(0);
    });
  });

  describe('limit query parameter', function() {
    it('should complain when limit parameter is not an integer', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  required: false,
                  schema: {
                    type: 'string',
                    default: '10',
                    maximum: '50'
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
                        required: ['resources', 'limit'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
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
        '/resources',
        'get',
        'parameters',
        0
      ]);
      expect(res.warnings[0].message).toEqual(
        'The limit parameter must be of type integer and optional with default and maximum values.'
      );
    });

    it('should complain when limit parameter is not optional', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  required: true,
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
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
                        required: ['resources', 'limit'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
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
        '/resources',
        'get',
        'parameters',
        0
      ]);
      expect(res.warnings[0].message).toEqual(
        'The limit parameter must be of type integer and optional with default and maximum values.'
      );
    });

    it('should complain when limit parameter does not specify a default value', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  schema: {
                    type: 'integer',
                    maximum: 50
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
                        required: ['resources', 'limit'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
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
        '/resources',
        'get',
        'parameters',
        0
      ]);
      expect(res.warnings[0].message).toEqual(
        'The limit parameter must be of type integer and optional with default and maximum values.'
      );
    });

    it('should complain when limit parameter does not specify a maximum value', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  schema: {
                    type: 'integer',
                    default: 10
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
                        required: ['resources', 'limit'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
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
        '/resources',
        'get',
        'parameters',
        0
      ]);
      expect(res.warnings[0].message).toEqual(
        'The limit parameter must be of type integer and optional with default and maximum values.'
      );
    });
  });

  describe('offset query parameter', function() {
    it('should complain when the offset parameter is not an integer', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
                  }
                },
                {
                  name: 'offset',
                  in: 'query',
                  description: 'offset',
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
                        required: ['resources', 'limit', 'offset'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
                          },
                          offset: {
                            description: 'offset',
                            type: 'integer'
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
        '/resources',
        'get',
        'parameters',
        1
      ]);
      expect(res.warnings[0].message).toEqual(
        'The offset parameter must be of type integer and optional.'
      );
    });

    it('should complain when the offset parameter is not optional', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
                  }
                },
                {
                  name: 'offset',
                  in: 'query',
                  description: 'offset',
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
                        required: ['resources', 'limit', 'offset'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
                          },
                          offset: {
                            description: 'offset',
                            type: 'integer'
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
        '/resources',
        'get',
        'parameters',
        1
      ]);
      expect(res.warnings[0].message).toEqual(
        'The offset parameter must be of type integer and optional.'
      );
    });
  });

  describe('start|cursor|page_token query parameter', function() {
    it('should complain when the start parameter is not a string or optional', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
                  }
                },
                {
                  name: 'start',
                  in: 'query',
                  description: 'start',
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
                        required: ['resources', 'limit'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
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
        '/resources',
        'get',
        'parameters',
        1
      ]);
      expect(res.warnings[0].message).toEqual(
        'The start parameter must be of type string and optional.'
      );
    });

    it('should complain when the cursor parameter is not a string or optional', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
                  }
                },
                {
                  name: 'cursor',
                  in: 'query',
                  description: 'cursor',
                  required: true,
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
                        required: ['resources', 'limit'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
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
        '/resources',
        'get',
        'parameters',
        1
      ]);
      expect(res.warnings[0].message).toEqual(
        'The cursor parameter must be of type string and optional.'
      );
    });
  });

  describe('limit property in response body', function() {
    it('should complain when limit property is not defined in response body', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  required: false,
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
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
                        required: ['resources', 'limit'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
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
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties'
      ]);
      expect(res.warnings[0].message).toEqual(
        'A paginated list operation must include a "limit" property in the response body schema.'
      );
    });

    it('should complain when limit property in response body is not an integer', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  required: false,
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
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
                        required: ['resources', 'limit'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
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
      expect(res.warnings.length).toEqual(1);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings[0].path).toEqual([
        'paths',
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'limit'
      ]);
      expect(res.warnings[0].message).toEqual(
        'The "limit" property in the response body of a paginated list operation must be of type integer and required.'
      );
    });

    it('should complain when limit property in response body is not required', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  required: false,
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
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
                        required: ['resources'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
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
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'limit'
      ]);
      expect(res.warnings[0].message).toEqual(
        'The "limit" property in the response body of a paginated list operation must be of type integer and required.'
      );
    });
  });

  describe('offset property in response body', function() {
    it('should complain when offset property is not defined in response body', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  required: false,
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
                  }
                },
                {
                  name: 'offset',
                  in: 'query',
                  description: 'offset',
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
                        required: ['resources', 'limit'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
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
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties'
      ]);
      expect(res.warnings[0].message).toEqual(
        'A paginated list operation with an "offset" parameter must include an "offset" property in the response body schema.'
      );
    });

    it('should complain when offset property in response body is not an integer', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  required: false,
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
                  }
                },
                {
                  name: 'offset',
                  in: 'query',
                  description: 'offset',
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
                        required: ['resources', 'limit', 'offset'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
                          },
                          offset: {
                            description: 'offset',
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
      expect(res.warnings.length).toEqual(1);
      expect(res.errors.length).toEqual(0);
      expect(res.warnings[0].path).toEqual([
        'paths',
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'offset'
      ]);
      expect(res.warnings[0].message).toEqual(
        'The "offset" property in the response body of a paginated list operation must be of type integer and required.'
      );
    });

    it('should complain when offset property in response body is not required', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  required: false,
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
                  }
                },
                {
                  name: 'offset',
                  in: 'query',
                  description: 'offset',
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
                        required: ['resources', 'limit'],
                        properties: {
                          resources: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
                          },
                          offset: {
                            description: 'offset',
                            type: 'integer'
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
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'offset'
      ]);
      expect(res.warnings[0].message).toEqual(
        'The "offset" property in the response body of a paginated list operation must be of type integer and required.'
      );
    });
  });

  describe('collection property in response body', function() {
    it('should complain when response body does not include an array property whose name matches the final segment of the path', function() {
      const spec = {
        paths: {
          '/resources': {
            get: {
              summary: 'this is a summary',
              operationId: 'operationId',
              parameters: [
                {
                  name: 'limit',
                  in: 'query',
                  description: 'limit',
                  required: false,
                  schema: {
                    type: 'integer',
                    default: 10,
                    maximum: 50
                  }
                },
                {
                  name: 'offset',
                  in: 'query',
                  description: 'offset',
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
                        required: ['items', 'limit', 'offset'],
                        properties: {
                          items: {
                            description: '',
                            type: 'array',
                            items: {
                              type: 'object'
                            }
                          },
                          limit: {
                            description: 'limit',
                            type: 'integer'
                          },
                          offset: {
                            description: 'offset',
                            type: 'integer'
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
        '/resources',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties'
      ]);
      expect(res.warnings[0].message).toEqual(
        'A paginated list operation must include an array property whose name matches the final segment of the path.'
      );
    });
  });
});
