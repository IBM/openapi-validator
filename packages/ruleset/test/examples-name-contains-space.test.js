const { examplesNameContainsSpace } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const name = 'examples-name-contains-space';

describe('Spectral rule: examples-name-contains-space', () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(
      name,
      examplesNameContainsSpace,
      rootDocument
    );

    expect(results).toHaveLength(0);
  });

  it('should error if a response example name contains a space', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        responses: {
          '201': {
            description: 'The created book',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string'
                    },
                    author: {
                      type: 'string'
                    },
                    length: {
                      type: 'integer'
                    }
                  }
                },
                examples: {
                  'create book response example': {
                    value:
                      '{"title": "Dune", "author": "Frank Herbert", length: 412 }'
                  }
                }
              }
            }
          }
        }
      }
    };

    const results = await testRule(
      name,
      examplesNameContainsSpace,
      testDocument
    );

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
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
      'create book response example'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
