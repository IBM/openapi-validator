/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { requestBodyIsObject } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-requestbody-is-object';
const rule = requestBodyIsObject;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(ruleId, rule, rootDocument);

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
          type: 'string',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should error if a request body is not an object', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.requestBody.content = {
      'application/json; charset=utf-8': {
        schema: {
          type: 'array',
          description: 'this should be an object',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
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
      'type',
    ]);
    expect(validation.severity).toBe(severityCodes.error);
  });
});
