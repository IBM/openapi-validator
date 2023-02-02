const { serverVariableDefaultValue } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const name = 'ibm-server-variable-default-value';

describe('Spectral rule: server-variable-default-value', () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(
      name,
      serverVariableDefaultValue,
      rootDocument
    );

    expect(results).toHaveLength(0);
  });

  it('should error if a server variable doesnt have a default value', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.servers = [
      {
        url: 'https://example.com',
        variables: {
          name: {
            description: 'this variable should have a non-empty default value',
            default: ''
          }
        }
      }
    ];

    const results = await testRule(
      name,
      serverVariableDefaultValue,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Server variable should have default value'
    );
    expect(validation.path).toStrictEqual([
      'servers',
      '0',
      'variables',
      'name',
      'default'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
