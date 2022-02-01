const { majorVersionInPath } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const name = 'major-version-in-path';

describe('Spectral rule: major-version-in-path', () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(name, majorVersionInPath, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should error when servers have urls with different versions', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.servers = [
      {
        url: 'https://some-madeup-url.com/api/v1'
      },
      {
        url: 'https://some-madeup-url.com/api/v2'
      }
    ];

    const results = await testRule(name, majorVersionInPath, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Major version segments of urls in servers object do not match. Found v1, v2'
    );
    expect(validation.path).toStrictEqual(['servers']);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error when paths start with different versions', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v2/some_path'] = {};

    const results = await testRule(name, majorVersionInPath, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Major version segments of paths object do not match. Found v1, v2'
    );
    expect(validation.path).toStrictEqual(['paths']);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error when no version is indicated anywhere', async () => {
    const testDocument = makeCopy(rootDocument);
    delete testDocument.paths;
    testDocument.paths = {
      '/movies': {}
    };

    const results = await testRule(name, majorVersionInPath, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Major version segment not present in either server URLs or paths'
    );
    expect(validation.path).toStrictEqual([]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
