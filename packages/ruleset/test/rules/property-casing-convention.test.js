/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { propertyCasingConvention } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-property-casing-convention';
const rule = propertyCasingConvention;
const expectedSeverity = severityCodes.error;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(ruleId, rule, rootDocument);
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
          deprecated: true,
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);
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
          description: 'Synopsis of the movie',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);
    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Property names must be snake case: plotSummary'
    );
    expect(validation.path.join('.')).toBe(
      'paths./v1/movies.post.requestBody.content.application/json.schema.properties'
    );
    expect(validation.severity).toBe(expectedSeverity);
  });
});
