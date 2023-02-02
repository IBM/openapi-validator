const { parameterSchemaOrContent } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const name = 'ibm-parameter-schema-or-content';

describe('Spectral rule: parameter-schema-or-content', () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(
      name,
      parameterSchemaOrContent,
      rootDocument
    );

    expect(results).toHaveLength(0);
  });

  it('should not error when a parameter has a schema', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.parameters = [
      {
        name: 'filter',
        in: 'query',
        schema: {
          type: 'string'
        }
      }
    ];

    const results = await testRule(
      name,
      parameterSchemaOrContent,
      testDocument
    );

    expect(results).toHaveLength(0);
  });

  it('should not error when a parameter has a content field', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.parameters = [
      {
        name: 'filter',
        in: 'query',
        content: {
          'application/json': {
            schema: {
              type: 'object'
            }
          }
        }
      }
    ];

    const results = await testRule(
      name,
      parameterSchemaOrContent,
      testDocument
    );

    expect(results).toHaveLength(0);
  });

  it('should error if a pararmeter does not have a schema or content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.parameters = [
      {
        name: 'filter',
        in: 'query'
      }
    ];

    const results = await testRule(
      name,
      parameterSchemaOrContent,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Parameter must provide either a schema or content'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'parameters',
      '0'
    ]);
    expect(validation.severity).toBe(severityCodes.error);
  });
});
