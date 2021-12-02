const { prohibitSummarySentenceStyle } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const name = 'prohibit-summary-sentence-style';

describe('Spectral rule: prohibit-summary-sentence-style', () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(
      name,
      prohibitSummarySentenceStyle,
      rootDocument
    );

    expect(results).toHaveLength(0);
  });

  it('should warn if an operation summary ends with a period', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.summary = 'Should not be a sentence.';

    const results = await testRule(
      name,
      prohibitSummarySentenceStyle,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Summary should not have a trailing period'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'summary'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
