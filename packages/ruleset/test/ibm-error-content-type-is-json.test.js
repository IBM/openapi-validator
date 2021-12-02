const { ibmErrorContentTypeIsJson } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const name = 'ibm-error-content-type-is-json';

describe('Spectral rule: ibm-error-content-type-is-json', () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(
      name,
      ibmErrorContentTypeIsJson,
      rootDocument
    );

    expect(results).toHaveLength(0);
  });

  it('should error if a response doesnt support application/json content', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.responses['500'] = {
      content: {
        'text/plain': {
          description: 'just error text'
        }
      }
    };

    const results = await testRule(
      name,
      ibmErrorContentTypeIsJson,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'error response should support application/json'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'responses',
      '500',
      'content'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
