const { contentEntryProvided } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const name = 'content-entry-provided';

describe('Spectral rule: content-entry-provided', () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(name, contentEntryProvided, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if 204 response is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].delete = {
      responses: {
        '204': {
          description: 'No content'
        }
      }
    };

    const results = await testRule(name, contentEntryProvided, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if 202 response is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].delete = {
      responses: {
        '202': {
          description: 'No content'
        }
      }
    };

    const results = await testRule(name, contentEntryProvided, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if 101 response is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].delete = {
      responses: {
        '101': {
          description: 'No content'
        }
      }
    };

    const results = await testRule(name, contentEntryProvided, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if 304 response is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].delete = {
      responses: {
        '304': {
          description: 'No content'
        }
      }
    };

    const results = await testRule(name, contentEntryProvided, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should error if 201 response is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post = {
      responses: {
        '201': {
          description: 'No content'
        }
      }
    };

    const results = await testRule(name, contentEntryProvided, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Request bodies and non-204 responses should define a content object'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'responses',
      '201'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if request body is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post = {
      requestBody: {
        description: 'No content'
      }
    };

    const results = await testRule(name, contentEntryProvided, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Request bodies and non-204 responses should define a content object'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'requestBody'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
