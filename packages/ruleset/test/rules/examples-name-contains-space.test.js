/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { examplesNameContainsSpace } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-no-space-in-example-name';
const rule = examplesNameContainsSpace;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(ruleId, rule, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should error if a response example name contains a space', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        responses: {
          201: {
            description: 'The created book',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                    },
                    author: {
                      type: 'string',
                    },
                    length: {
                      type: 'integer',
                    },
                  },
                },
                examples: {
                  'create book response example': {
                    value:
                      '{"title": "Dune", "author": "Frank Herbert", length: 412 }',
                  },
                },
              },
            },
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe('Examples name should not contain space');
    expect(validation.path).toStrictEqual([
      'paths',
      'v1/books',
      'post',
      'responses',
      '201',
      'content',
      'application/json',
      'examples',
      'create book response example',
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
