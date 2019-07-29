const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/pagination-responses');

const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - responses', function() {
  describe('inline response schemas', function() {
    describe('Pagination', function() {
      it('should complain when a paginated response does not have the next property', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                responses: {
                  '200': {
                    content: {
                      'plain/text': {
                        schema: {
                          limit: 50,
                          offset: 20,
                          total_count: 232,
                          first: 'http://api.bluemix.net/v2/accounts?limit=50',
                          last:
                            'http://api.bluemix.net/v2/accounts?offset=200&limit=50',
                          previous:
                            'http://api.bluemix.net/v2/accounts?offset=50&limit=50',
                          accounts: [],
                          required: []
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

      it('should complain when a paginated response hass offset or limit as query parameter but not defined', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                responses: {
                  '200': {
                    content: {
                      'plain/text': {
                        schema: {
                          start: 20,
                          total_count: 232,
                          first: 'http://api.bluemix.net/v2/accounts?limit=50',
                          last:
                            'http://api.bluemix.net/v2/accounts?offset=200&limit=50',
                          next:
                            'http://api.bluemix.net/v2/accounts?offset=150&limit=50',
                          previous:
                            'http://api.bluemix.net/v2/accounts?offset=50&limit=50',
                          accounts: [],
                          required: []
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

      it('should complain when a paginated response hass offset or limit as query parameter but not defined', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                responses: {
                  '200': {
                    content: {
                      'plain/text': {
                        schema: {
                          limit: 20,
                          offset: 50,
                          total_count: 232,
                          first:
                            'http://api.bluemix.net/v2/accounts?start=0&limit=50',
                          last:
                            'http://api.bluemix.net/v2/accounts?offset=200&limit=50',
                          next:
                            'http://api.bluemix.net/v2/accounts?offset=150&limit=50',
                          previous:
                            'http://api.bluemix.net/v2/accounts?offset=50&limit=50',
                          accounts: [],
                          required: []
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
          'if a start, cursor, or token exist as a parameter query then `next.token` or `next_token` or `next.cursor` or `next_cursor` must be defined'
        );
      });
      it('should complain when a paginated response misdefines total_count', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                responses: {
                  '200': {
                    content: {
                      'plain/text': {
                        schema: {
                          start: 0,
                          limit: 20,
                          offset: 50,
                          total_count: '232',
                          first:
                            'http://api.bluemix.net/v2/accounts?start=0&limit=50',
                          last:
                            'http://api.bluemix.net/v2/accounts?offset=200&limit=50',
                          next:
                            'http://api.bluemix.net/v2/accounts?offset=150&limit=50',
                          previous:
                            'http://api.bluemix.net/v2/accounts?offset=50&limit=50',
                          accounts: [],
                          required: []
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
          'total_count must be of type integer'
        );
      });
      it('should complain when the paginated object has limit or offset as a query parameter but not defined in the spec', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                responses: {
                  '200': {
                    content: {
                      'plain/text': {
                        schema: {
                          pagination: {
                            total_count: 232,
                            first:
                              'http://api.bluemix.net/v2/accounts?limit=50',
                            last:
                              'http://api.bluemix.net/v2/accounts?offset=200&limit=50',
                            next_url:
                              'http://api.bluemix.net/v2/accounts?offset=150&limit=50',
                            previous:
                              'http://api.bluemix.net/v2/accounts?offset=50&limit=50',
                            accounts: [],
                            required: []
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
          'if limit or offset parameters exist as a parameter query, then they must be defined as properties'
        );
      });

      it('should complain when the paginated object misdefines total_count', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                responses: {
                  '200': {
                    content: {
                      'plain/text': {
                        schema: {
                          pagination: {
                            total_count: '232',
                            first:
                              'http://api.bluemix.net/v2/accounts?limit=50',
                            last:
                              'http://api.bluemix.net/v2/accounts?offset=200&limit=50',
                            next_url:
                              'http://api.bluemix.net/v2/accounts?offset=150&limit=50',
                            previous:
                              'http://api.bluemix.net/v2/accounts?offset=50&limit=50',
                            accounts: [],
                            required: []
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
          'total_count must be of type integer'
        );
      });

      it('should complain when the paginated object does not have start, cursor, or token', function() {
        const spec = {
          paths: {
            '/pets': {
              get: {
                summary: 'this is a summary',
                operationId: 'operationId',
                responses: {
                  '200': {
                    content: {
                      'plain/text': {
                        schema: {
                          pagination: {
                            total_count: 232,
                            limit: 50,
                            offset: 50,
                            first:
                              'http://api.bluemix.net/v2/accounts?start=50&limit=50',
                            last:
                              'http://api.bluemix.net/v2/accounts?offset=200&limit=50',
                            next_url:
                              'http://api.bluemix.net/v2/accounts?offset=150&limit=50',
                            previous:
                              'http://api.bluemix.net/v2/accounts?offset=50&limit=50',
                            accounts: [],
                            required: ['limit', 'offset']
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
          'if a start, cursor, or token exist as a parameter query then `next.token` or `next_token` or `next.cursor` or `next_cursor` must be defined'
        );
      });
    });
  });
});
