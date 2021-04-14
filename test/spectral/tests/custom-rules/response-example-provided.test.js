const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const inCodeValidator = require('../../../../src/lib');

describe('spectral - test validation that schema provided in content object', function() {
  it('should not error when a response example provided in the schema or at the response level', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          get: {
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
                      type: 'string',
                      example: 'example string'
                    }
                  }
                }
              },
              '400': {
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
                    },
                    example: 'example string'
                  }
                }
              },
              '404': {
                content: {
                  'application/json': {
                    schema: {
                      type: 'string'
                    },
                    examples: {
                      example1: {
                        value: 'example string 1'
                      },
                      example2: {
                        value: 'example string 2'
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

    const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message === 'Response bodies should include an example response'
    );
    expect(expectedWarnings.length).toBe(0);
  });

  it('should only error when a response example is not provided in a success response', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          get: {
            responses: {
              '200': {
                content: {
                  'application/json': {
                    // schema provided
                    schema: {
                      type: 'string'
                    }
                  }
                }
              },
              '300': {
                content: {
                  'application/json': {
                    // schema provided
                    schema: {
                      type: 'string'
                    }
                  }
                }
              },
              default: {
                content: {
                  'application/json': {
                    // schema provided
                    schema: {
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

    const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.warnings.filter(
      warn =>
        warn.message === 'Response bodies should include an example response'
    );
    expect(expectedWarnings.length).toBe(1);
  });

  it('should not error on a clean API definition with response examples', async () => {
    const spec = yaml.safeLoad(
      fs.readFileSync(
        path.join(__dirname, '../../../cli-validator/mockFiles/oas3/clean.yml')
      )
    );

    const res = await inCodeValidator(spec, true);
    expect(res.warnings).toBeUndefined();
  });
});
