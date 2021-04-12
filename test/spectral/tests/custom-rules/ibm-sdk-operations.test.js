const inCodeValidator = require('../../../../src/lib');

describe('spectral - test that x-sdk-operations schema violations cause errors', function() {
  let res;

  beforeAll(async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'ErrorAPI'
      },
      servers: [{ url: 'http://api.errorapi.com/v1' }],
      paths: {
        path1: {
          post: {
            'x-sdk-operations': {
              'request-examples': {
                type: 13,
                notafield: 'asdf'
              }
            }
          }
        }
      }
    };

    res = await inCodeValidator(spec, true);
  });

  it('should warn for invalid x-sdk-operations schema', function() {
    const expectedWarnings = res.warnings.filter(
      warn => warn.rule === 'ibm-sdk-operations'
    );
    expect(expectedWarnings.length).toBe(1);
    expect(expectedWarnings[0].path).toEqual([
      'paths',
      'path1',
      'post',
      'x-sdk-operations',
      'request-examples',
      'type'
    ]);
  });
});
