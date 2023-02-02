const { requestBodyObject } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const name = 'ibm-request-body-object';

describe('Spectral rule: request-body-object', () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(name, requestBodyObject, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if response body has no type but has properties', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.requestBody.content[
      'application/json'
    ].schema = {
      description: 'this is implicitly an object',
      properties: {
        foo: {
          type: 'string'
        }
      }
    };

    const results = await testRule(name, requestBodyObject, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should error if a request body is not an object', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.requestBody.content = {
      'application/json; charset=utf-8': {
        schema: {
          type: 'array',
          description: 'this should be an object'
        }
      }
    };

    const results = await testRule(name, requestBodyObject, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'All request bodies MUST be structured as an object'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'requestBody',
      'content',
      'application/json; charset=utf-8',
      'schema',
      'type'
    ]);
    expect(validation.severity).toBe(severityCodes.error);
  });
});
