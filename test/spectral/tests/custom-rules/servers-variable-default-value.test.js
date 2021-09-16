const inCodeValidator = require('../../../../src/lib');

describe('spectral - test whether servers variables have default value', () => {
  it('should not throw warn when servers variables have value', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Server variables have default value'
      },
      servers: [
        {
          url: 'https://example.com',
          description: 'This server does not have variable'
        },
        {
          url: 'http://example2.com/{variable1}',
          description: 'This server does have variable, but it has value.',
          variables: {
            variable1: {
              default: 'default value',
              description: 'Warning will not be displayed'
            }
          }
        },
        {
          url: 'http://example2.com/{variable1}/{variable2}',
          description: 'This server has multiple variable with default values',
          variables: {
            variable1: {
              default: 'default value',
              description: 'some description'
            },
            variable2: {
              default: 'default value2',
              description: 'some description'
            }
          }
        }
      ],
      paths: {}
    };
    const res = await inCodeValidator(spec, true);
    const result = res.warnings.find(
      elem => elem.rule === 'server-variable-default-value'
    );
    expect(result).toBeUndefined();
  });

  it('should show warning when server variable does not have default value', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Server variable does not have default value'
      },
      servers: [
        {
          url: 'https://example.com',
          description:
            'Since the variable does not have value a warning will be displayed',
          variables: {
            name: {
              default: ''
            }
          }
        }
      ],
      paths: {}
    };
    const res = await inCodeValidator(spec, true);
    const errorMessageFind = res.warnings.find(
      elem => elem.message === 'Server variable should have default value'
    );
    expect(errorMessageFind).not.toBeUndefined();

    const expectedPath = ['servers', '0', 'variables', 'name', 'default'];
    expect(errorMessageFind.path.sort().join('')).toBe(
      expectedPath.sort().join('')
    );
  });

  it('should show warning when multiple server variable default value does not have default value', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Server variable does not have default value'
      },
      servers: [
        {
          url: 'https://example.com',
          description:
            'Since the variable does not have value a warning will be displayed',
          variables: {
            name: {
              default: ''
            },
            address: {
              default: ''
            }
          }
        }
      ],
      paths: {}
    };
    const res = await inCodeValidator(spec, true);
    const errorMessageFilter = res.warnings.filter(
      elem => elem.message === 'Server variable should have default value'
    );
    expect(errorMessageFilter.length).toBe(2);
    expect(errorMessageFilter[0].path).toEqual([
      'servers',
      '0',
      'variables',
      'name',
      'default'
    ]);
    expect(errorMessageFilter[1].path).toEqual([
      'servers',
      '0',
      'variables',
      'address',
      'default'
    ]);
  });
});
