const inCodeValidator = require('../../../../src/lib');

describe('spectral - HEAD request response should not have body', () => {
  it('should not show warning when HEAD request response does not have body', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        title: 'Title',
        version: '1.0.0'
      },
      paths: {
        downloadStuff1: {
          head: {
            operationId: 'get_stuff_size',
            responses: {
              '200': {
                description: 'some description',
                headers: {}
              }
            }
          }
        }
      },
      components: {
        responses: {
          GenericResponse: {
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    };
    const result = await inCodeValidator(spec, true);
    expect(result).not.toBeUndefined();
    const res = result.warnings.find(
      o => o.rule === 'head-request-should-not-have-response-body'
    );
    expect(res).toBeUndefined();
  });

  it('should show warning when HEAD request response has content via reference', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        title: 'title',
        version: '1.0.0'
      },
      paths: {
        downloadStuff1: {
          head: {
            operationId: 'get_stuff_size',
            responses: {
              '200': {
                $ref: '#/components/responses/GenericResponse',
                description: {},
                headers: {}
              }
            }
          }
        }
      },
      components: {
        responses: {
          GenericResponse: {
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    };
    const result = await inCodeValidator(spec, true);
    expect(result).not.toBeUndefined();
    const warnings = result.warnings.filter(
      f => f.rule === 'head-request-should-not-have-response-body'
    );
    expect(warnings[0].path).toEqual([
      'paths',
      'downloadStuff1',
      'head',
      'responses',
      '200',
      'content'
    ]);
  });

  it('should show warning when HEAD request response has content', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        title: 'title',
        version: '1.0.0'
      },
      paths: {
        downloadStuff1: {
          head: {
            operationId: 'get_stuff_size',
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
                    }
                  }
                },
                description: {},
                headers: {}
              }
            }
          }
        }
      },
      components: {
        responses: {
          GenericResponse: {
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                }
              }
            },
            description: {},
            headers: {}
          }
        }
      }
    };
    const result = await inCodeValidator(spec, true);
    expect(result).not.toBeUndefined();
    const warnings = result.warnings.filter(
      f => f.rule === 'head-request-should-not-have-response-body'
    );
    expect(warnings[0].path).toEqual([
      'paths',
      'downloadStuff1',
      'head',
      'responses',
      '200',
      'content'
    ]);
  });

  it('should show warning when there are multiple HEAD requests and one of them response has content', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        title: 'title',
        version: '1.0.0'
      },
      paths: {
        downloadStuff1: {
          head: {
            operationId: 'get_stuff_size',
            responses: {
              '200': {
                description: {},
                headers: {}
              }
            }
          }
        },
        downloadStuff2: {
          head: {
            operationId: 'get_stuff_size2',
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
                    }
                  }
                },
                description: {},
                headers: {}
              }
            }
          }
        }
      },
      components: {
        responses: {
          GenericResponse: {
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                }
              }
            },
            description: {},
            headers: {}
          }
        }
      }
    };
    const result = await inCodeValidator(spec, true);
    expect(result).not.toBeUndefined();
    const warnings = result.warnings.filter(
      f => f.rule === 'head-request-should-not-have-response-body'
    );
    expect(warnings[0].path).toEqual([
      'paths',
      'downloadStuff2',
      'head',
      'responses',
      '200',
      'content'
    ]);
  });
});
