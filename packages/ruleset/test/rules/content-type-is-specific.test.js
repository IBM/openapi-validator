/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { contentTypeIsSpecific } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-content-type-is-specific';
const rule = contentTypeIsSpecific;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(ruleId, rule, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should error if a parameters content has a wildcard content type', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.parameters = [
      {
        name: 'metadata',
        in: 'header',
        content: {
          '*/*': {
            description: 'maybe not *all* content types',
          },
        },
      },
    ];

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      '*/* should only be used when all content types are supported'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'parameters',
      '0',
      'content',
      '*/*',
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if a request bodies content has a wildcard content type', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.requestBody = {
      content: {
        '*/*': {
          description: 'maybe not *all* content types',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      '*/* should only be used when all content types are supported'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'requestBody',
      'content',
      '*/*',
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error if a responses content has a wildcard content type', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.responses = {
      201: {
        content: {
          '*/*': {
            description: 'maybe not *all* content types',
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      '*/* should only be used when all content types are supported'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'responses',
      '201',
      'content',
      '*/*',
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
