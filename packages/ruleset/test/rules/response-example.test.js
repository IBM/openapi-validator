/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { responseExampleExists } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-success-response-example';
const rule = responseExampleExists;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(ruleId, rule, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if response has an `examples` field', async () => {
    // note that the other two positive examples:
    // 1. a responses media type containing an `example` field and
    // 2. a responses schema (within the media type) containing an `example` field
    // are covered in the root document

    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.responses['201'].content[
      'application/json'
    ].examples = [{ value: { name: 'The Return of the King' } }];

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should warn if a response has no example', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.responses['201'].content[
      'application/json'
    ] = {
      schema: {
        type: 'object',
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Response bodies should include an example response'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'responses',
      '201',
      'content',
      'application/json',
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
