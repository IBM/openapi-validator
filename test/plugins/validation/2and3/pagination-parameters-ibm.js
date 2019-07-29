const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/pagination-parameters-ibm');

const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - pagination-parameters-ibm', () => {
  describe('Pagination', () => {
    it('should return an error for invalid start definitions', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'start',
                  in: 'header',
                  schema: {
                    type: 'string'
                  },
                  description: 'good description',
                  required: true
                },
                {
                  name: 'limit',
                  in: 'header',
                  schema: {
                    type: 'integer',
                    default: 50
                  },
                  description: 'good description',
                  required: false
                },
                {
                  name: 'offset',
                  in: 'header',
                  schema: {
                    type: 'integer',
                    default: 20
                  },
                  description: 'good description',
                  required: false
                }
              ],
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
      expect(res.warnings[0].message).toEqual(
        'start parameter must be of type string and must be optional'
      );
    });

    it('should complain for invalid cursor definitions', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'cursor',
                  in: 'header',
                  schema: {
                    type: 'string'
                  },
                  description: 'good description',
                  required: true
                },
                {
                  name: 'limit',
                  in: 'header',
                  schema: {
                    type: 'integer',
                    default: 50
                  },
                  description: 'good description',
                  required: false
                },
                {
                  name: 'offset',
                  in: 'header',
                  schema: {
                    type: 'integer',
                    default: 20
                  },
                  description: 'good description',
                  required: false
                }
              ],
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
      expect(res.warnings[0].message).toEqual(
        'cursor parameter must be of type string and must be optional'
      );
    });

    it('should complain for invalid use of limit definitions', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'limit',
                  in: 'header',
                  schema: {
                    type: 'string'
                  },
                  description: 'good description',
                  required: true
                },
                {
                  name: 'offset',
                  in: 'header',
                  schema: {
                    type: 'integer',
                    default: 20
                  },
                  description: 'good description',
                  required: false
                }
              ],
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
      expect(res.warnings[0].message).toEqual(
        'limit parameter is optional and must be of type integer and must have a default value'
      );
      expect(res.warnings[0].path).toEqual([]);
    });

    it('should complain for invalid use of offset definitions when start or cursor is missing', () => {
      const spec = {
        paths: {
          '/pets': {
            get: {
              parameters: [
                {
                  name: 'limit',
                  in: 'header',
                  schema: {
                    type: 'integer',
                    default: 50
                  },
                  description: 'good description',
                  required: false
                }
              ],
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
      expect(res.warnings[0].message).toEqual(
        'if start or cursor parameters are not present then the offset parameter should be defined as an integer and should be optional'
      );
    });
  });
});
