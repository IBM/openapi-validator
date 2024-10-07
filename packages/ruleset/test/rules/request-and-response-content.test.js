/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { requestAndResponseContent } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-request-and-response-content';
const rule = requestAndResponseContent;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(ruleId, rule, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if 204 response is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].delete = {
      responses: {
        204: {
          description: 'No content',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if 202 response is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].delete = {
      responses: {
        202: {
          description: 'No content',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if 101 response is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].delete = {
      responses: {
        101: {
          description: 'No content',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if 304 response is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].delete = {
      responses: {
        304: {
          description: 'No content',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if HEAD response is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].head = {
      responses: {
        200: {
          description: 'No content',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if OPTIONS response is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].options = {
      responses: {
        200: {
          description: 'No content',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if TRACE response is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].trace = {
      responses: {
        200: {
          description: 'No content',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if 201 response for PUT on minimally represented resource is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies/{id}/genres/{genre}'] = {
      get: {
        operationId: 'check_movie_genre',
        responses: {
          204: {
            description: 'No content - checked',
          },
        },
      },
      put: {
        operationId: 'add_movie_genre',
        responses: {
          201: {
            description: 'No content - created',
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);
    expect(results).toHaveLength(0);
  });

  it('should error if 201 response is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post = {
      responses: {
        201: {
          description: 'No content',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Request bodies and non-204 responses should define a content object'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'responses',
      '201',
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if request body is missing content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post = {
      requestBody: {
        description: 'No content',
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Request bodies and non-204 responses should define a content object'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'requestBody',
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
