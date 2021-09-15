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
          description: 'Description'
        },
        {
          url: 'http://example2.com/{variable1}',
          description: 'Description 2',
          variables: {
            variable1: {
              default: 'default value',
              description: 'some description'
            }
          }
        },
        {
          url: 'http://example2.com/{variable1}/{variable2}',
          description: 'Description 3',
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

  it('should show warning when server default does not have default value', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Server variables have default value'
      },
      servers: [
        {
          url: 'https://example.com',
          description: 'Description',
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
    const result = res.warnings.find(
      elem => elem.rule === 'server-variable-default-value'
    );
    expect(result).not.toBeUndefined();
  });
});
