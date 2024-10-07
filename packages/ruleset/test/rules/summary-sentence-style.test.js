/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { summarySentenceStyle } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-summary-sentence-style';
const rule = summarySentenceStyle;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(ruleId, rule, rootDocument);
    expect(results).toHaveLength(0);
  });

  it('should warn if an operation summary ends with a period', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.summary = 'Should not be a sentence.';

    const results = await testRule(ruleId, rule, testDocument);
    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Operation summaries should not have a trailing period'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'summary',
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
