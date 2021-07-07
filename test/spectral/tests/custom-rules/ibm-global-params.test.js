const inCodeValidator = require('../../../../src/lib');

describe('spectral - test global params validation', function() {
  it('should issue warning only for unmarked global params', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          get: {
            parameters: [
              {
                // no warning, not global
                name: 'dummyParam',
                in: 'query',
                description: 'not global',
                schema: {
                  type: 'string'
                }
              },
              {
                name: 'globalParam1',
                in: 'query',
                description: 'global parameter',
                // no warning, x-sdk-global-param used correctly
                'x-sdk-global-param': true,
                schema: {
                  type: 'string'
                }
              },
              {
                name: 'globalParam2',
                in: 'query',
                description: 'global parameter',
                // warning 1, missing x-sdk-global-param
                schema: {
                  type: 'string'
                }
              }
            ]
          },
          post: {
            parameters: [
              {
                name: 'globalParam1',
                in: 'query',
                description: 'global parameter',
                // warning 2, missing x-sdk-global-param
                schema: {
                  type: 'string'
                }
              },
              {
                name: 'globalParam2',
                in: 'query',
                description: 'global parameter',
                // no warning, x-sdk-global-param used correctly
                'x-sdk-global-param': true,
                schema: {
                  type: 'string'
                }
              }
            ]
          }
        },
        path2: {
          get: {
            parameters: [
              {
                name: 'globalParam1',
                in: 'query',
                description: 'global parameter',
                // warning 3, missing x-sdk-global-param
                schema: {
                  type: 'string'
                }
              },
              {
                name: 'globalParam2',
                in: 'query',
                description: 'global parameter',
                // warning 4, missing x-sdk-global-param
                schema: {
                  type: 'string'
                }
              }
            ]
          }
        }
      }
    };

    const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.warnings.filter(
      warn => warn.rule === 'ibm-global-params'
    );
    expect(expectedWarnings.length).toBe(4);
    expect(expectedWarnings[0].path).toEqual([
      'paths',
      'path1',
      'get',
      'parameters',
      '2'
    ]);
    expect(expectedWarnings[1].path).toEqual([
      'paths',
      'path1',
      'post',
      'parameters',
      '0'
    ]);
    expect(expectedWarnings[2].path).toEqual([
      'paths',
      'path2',
      'get',
      'parameters',
      '0'
    ]);
    expect(expectedWarnings[3].path).toEqual([
      'paths',
      'path2',
      'get',
      'parameters',
      '1'
    ]);
  });
});
