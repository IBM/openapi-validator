const { stringBoundary } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const name = 'string-boundary';

describe('Spectral rule: string-boundary', () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(name, stringBoundary, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error when string schema has only an enum', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.parameters = [
      {
        name: 'filter',
        in: 'query',
        schema: {
          type: 'string',
          enum: ['fiction', 'nonfiction']
        }
      }
    ];

    const results = await testRule(name, stringBoundary, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error when string schema is in a not', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.parameters = [
      {
        name: 'filter',
        in: 'query',
        schema: {
          type: 'integer',
          not: {
            type: 'string'
          }
        }
      }
    ];

    const results = await testRule(name, stringBoundary, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error for missing pattern when format is binary, byte, date, date-time, or url', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.parameters = [
      {
        name: 'hash',
        in: 'query',
        schema: {
          type: 'string',
          format: 'binary',
          minLength: 0,
          maxLength: 15
        }
      },
      {
        name: 'trailer',
        in: 'query',
        schema: {
          type: 'string',
          format: 'byte',
          minLength: 0,
          maxLength: 1024
        }
      },
      {
        name: 'before_date',
        in: 'query',
        schema: {
          type: 'string',
          format: 'date'
        }
      },
      {
        name: 'after_date',
        in: 'query',
        schema: {
          type: 'string',
          format: 'date-time',
          minLength: 1,
          maxLength: 15
        }
      },
      {
        name: 'imdb_url',
        in: 'query',
        schema: {
          type: 'string',
          format: 'url',
          maxLength: 1024
        }
      }
    ];

    const results = await testRule(name, stringBoundary, testDocument);
    expect(results).toHaveLength(0);
  });

  it('should error if string schema is missing a `pattern` field', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.parameters = [
      {
        name: 'filter',
        in: 'query',
        schema: {
          type: 'string',
          minLength: 1,
          maxLength: 15
        }
      }
    ];

    const results = await testRule(name, stringBoundary, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Should define a pattern for a valid string'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'parameters',
      '0',
      'schema'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if string schema is missing a `minLength` field', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.parameters = [
      {
        name: 'metadata',
        in: 'header',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              pattern: '[a-zA-Z0-9]+',
              maxLength: 15
            }
          }
        }
      }
    ];

    const results = await testRule(name, stringBoundary, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Should define a minLength for a valid string'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'parameters',
      '0',
      'content',
      'text/plain',
      'schema'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if string schema is missing a `maxLength` field', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.requestBody.content['text/plain'] = {
      schema: {
        type: 'string',
        pattern: '[a-zA-Z0-9]+',
        minLength: 15
      }
    };

    const results = await testRule(name, stringBoundary, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Should define a maxLength for a valid string'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'requestBody',
      'content',
      'text/plain',
      'schema'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if non-string schema defines a `pattern` field', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.requestBody.content['text/plain'] = {
      schema: {
        type: 'integer',
        pattern: '.*'
      }
    };

    const results = await testRule(name, stringBoundary, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'pattern should not be defined for a non-string schema'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'requestBody',
      'content',
      'text/plain',
      'schema',
      'pattern'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if non-string schema defines a `minLength` field', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.requestBody.content['text/plain'] = {
      schema: {
        type: 'integer',
        minLength: 15
      }
    };

    const results = await testRule(name, stringBoundary, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'minLength should not be defined for a non-string schema'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'requestBody',
      'content',
      'text/plain',
      'schema',
      'minLength'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if non-string schema defines a `maxLength` field', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.requestBody.content['text/plain'] = {
      schema: {
        type: 'integer',
        maxLength: 15
      }
    };

    const results = await testRule(name, stringBoundary, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'maxLength should not be defined for a non-string schema'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'requestBody',
      'content',
      'text/plain',
      'schema',
      'maxLength'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if string schema has a `minLength` value greater than the `maxLength` value', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.requestBody.content['text/plain'] = {
      schema: {
        type: 'string',
        pattern: '[a-zA-Z0-9]+',
        maxLength: 10,
        minLength: 15
      }
    };

    const results = await testRule(name, stringBoundary, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'minLength cannot be greater than maxLength'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'requestBody',
      'content',
      'text/plain',
      'schema'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if faulty string schema is part of a composed schema', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.requestBody.content['text/plain'] = {
      schema: {
        allOf: [
          {
            type: 'string',
            maxLength: 10,
            minLength: 1
          },
          {
            anyOf: [
              {
                type: 'string',
                maxLength: 10,
                minLength: 1
              },
              {
                oneOf: [
                  {
                    type: 'string',
                    maxLength: 10,
                    minLength: 1
                  }
                ]
              }
            ]
          }
        ]
      }
    };

    const results = await testRule(name, stringBoundary, testDocument);

    expect(results).toHaveLength(3);

    results.forEach(r => {
      expect(r.code).toBe(name);
      expect(r.message).toBe('Should define a pattern for a valid string');
      expect(r.severity).toBe(severityCodes.warning);
    });

    expect(results[0].path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'requestBody',
      'content',
      'text/plain',
      'schema',
      'allOf',
      '0'
    ]);

    expect(results[1].path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'requestBody',
      'content',
      'text/plain',
      'schema',
      'allOf',
      '1',
      'anyOf',
      '0'
    ]);

    expect(results[2].path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'requestBody',
      'content',
      'text/plain',
      'schema',
      'allOf',
      '1',
      'anyOf',
      '1',
      'oneOf',
      '0'
    ]);
  });

  it('should error if faulty string schema is defined at path level', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].parameters = [
      {
        name: 'filter',
        in: 'query',
        schema: {
          type: 'string',
          minLength: 1,
          maxLength: 15
        }
      }
    ];

    const results = await testRule(name, stringBoundary, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Should define a pattern for a valid string'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'parameters',
      '0',
      'schema'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
