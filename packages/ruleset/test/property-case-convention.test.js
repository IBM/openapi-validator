const { propertyCaseConvention } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const name = 'ibm-property-case-convention';
const expectedSeverity = severityCodes.error;

describe('Spectral rule: property-case-convention', () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(name, propertyCaseConvention, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if non-snake case property is deprecated', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.requestBody.content[
      'application/json'
    ].schema = {
      type: 'object',
      description: 'alternate movie schema',
      properties: {
        plotSummary: {
          type: 'string',
          description: 'Synopsis of the movie',
          deprecated: true
        }
      }
    };

    const results = await testRule(name, propertyCaseConvention, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should error if schema property name is not snake case', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v1/movies'].post.requestBody.content[
      'application/json'
    ].schema = {
      type: 'object',
      description: 'alternate movie schema',
      properties: {
        plotSummary: {
          type: 'string',
          description: 'Synopsis of the movie'
        }
      }
    };

    const results = await testRule(name, propertyCaseConvention, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Property names must be snake case: plotSummary'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      '/v1/movies',
      'post',
      'requestBody',
      'content',
      'application/json',
      'schema',
      'properties'
    ]);
    expect(validation.severity).toBe(expectedSeverity);
  });
});
