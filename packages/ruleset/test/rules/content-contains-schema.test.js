/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { contentContainsSchema } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-content-contains-schema';
const rule = contentContainsSchema;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(ruleId, rule, rootDocument);

    expect(results).toHaveLength(0);
  });

  // for post, put, and patch
  it('should error when request body content field is missing a schema field', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/books'] = {
      post: {
        requestBody: {
          content: {
            'application/json': {
              description: 'should have a schema',
            },
          },
        },
      },
      put: {
        requestBody: {
          content: {
            'application/json': {
              description: 'should have a schema',
            },
          },
        },
      },
      patch: {
        requestBody: {
          content: {
            'application/json': {
              description: 'should have a schema',
            },
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(3);

    results.forEach(r => {
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe('Content entries must specify a schema');
      expect(r.severity).toBe(severityCodes.warning);
    });

    expect(results[0].path).toStrictEqual([
      'paths',
      '/v1/books',
      'post',
      'requestBody',
      'content',
      'application/json',
    ]);

    expect(results[1].path).toStrictEqual([
      'paths',
      '/v1/books',
      'put',
      'requestBody',
      'content',
      'application/json',
    ]);

    expect(results[2].path).toStrictEqual([
      'paths',
      '/v1/books',
      'patch',
      'requestBody',
      'content',
      'application/json',
    ]);
  });

  // for get, post, put, patch, and delete
  it('should error when a parameters content field is missing a schema field', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/books'] = {
      post: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                description: 'this should have a schema',
              },
            },
          },
        ],
      },
      put: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                description: 'this should have a schema',
              },
            },
          },
        ],
      },
      patch: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                description: 'this should have a schema',
              },
            },
          },
        ],
      },
      get: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                description: 'this should have a schema',
              },
            },
          },
        ],
      },
      delete: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                description: 'this should have a schema',
              },
            },
          },
        ],
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(5);

    results.forEach(r => {
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe('Content entries must specify a schema');
      expect(r.severity).toBe(severityCodes.warning);
    });

    expect(results[0].path).toStrictEqual([
      'paths',
      '/v1/books',
      'post',
      'parameters',
      '0',
      'content',
      'application/json',
    ]);

    expect(results[1].path).toStrictEqual([
      'paths',
      '/v1/books',
      'put',
      'parameters',
      '0',
      'content',
      'application/json',
    ]);

    expect(results[2].path).toStrictEqual([
      'paths',
      '/v1/books',
      'patch',
      'parameters',
      '0',
      'content',
      'application/json',
    ]);

    expect(results[3].path).toStrictEqual([
      'paths',
      '/v1/books',
      'get',
      'parameters',
      '0',
      'content',
      'application/json',
    ]);

    expect(results[4].path).toStrictEqual([
      'paths',
      '/v1/books',
      'delete',
      'parameters',
      '0',
      'content',
      'application/json',
    ]);
  });

  // for get, post, put, patch, and delete
  it('should error when a responses content field is missing a schema field', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/books'] = {
      post: {
        responses: {
          200: {
            content: {
              'application/json': {
                description: 'this should have a schema',
              },
            },
          },
        },
      },
      put: {
        responses: {
          200: {
            content: {
              'application/json': {
                description: 'this should have a schema',
              },
            },
          },
        },
      },
      patch: {
        responses: {
          200: {
            content: {
              'application/json': {
                description: 'this should have a schema',
              },
            },
          },
        },
      },
      get: {
        responses: {
          200: {
            content: {
              'application/json': {
                description: 'this should have a schema',
              },
            },
          },
        },
      },
      delete: {
        responses: {
          200: {
            content: {
              'application/json': {
                description: 'this should have a schema',
              },
            },
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(5);

    results.forEach(r => {
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe('Content entries must specify a schema');
      expect(r.severity).toBe(severityCodes.warning);
    });

    expect(results[0].path).toStrictEqual([
      'paths',
      '/v1/books',
      'post',
      'responses',
      '200',
      'content',
      'application/json',
    ]);

    expect(results[1].path).toStrictEqual([
      'paths',
      '/v1/books',
      'put',
      'responses',
      '200',
      'content',
      'application/json',
    ]);

    expect(results[2].path).toStrictEqual([
      'paths',
      '/v1/books',
      'patch',
      'responses',
      '200',
      'content',
      'application/json',
    ]);

    expect(results[3].path).toStrictEqual([
      'paths',
      '/v1/books',
      'get',
      'responses',
      '200',
      'content',
      'application/json',
    ]);

    expect(results[4].path).toStrictEqual([
      'paths',
      '/v1/books',
      'delete',
      'responses',
      '200',
      'content',
      'application/json',
    ]);
  });
});
