/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getExamplesForSchema } = require('../src');

describe('Utility function: getExamplesForSchema()', () => {
  it('should return `[]` for `undefined`', async () => {
    expect(getExamplesForSchema(undefined)).toEqual([]);
  });

  it('should return `[]` for `null`', async () => {
    expect(getExamplesForSchema(null)).toEqual([]);
  });

  it('should return `[]` for empty object', async () => {
    expect(getExamplesForSchema({})).toEqual([]);
  });

  it('should return examples for simple schema', async () => {
    expect(
      getExamplesForSchema({
        examples: ['three', 'two', 'one'],
      }).sort()
    ).toEqual(['three', 'two', 'one'].sort());
  });

  it('should return single example for simple schema', async () => {
    expect(
      getExamplesForSchema({
        example: 'one',
      })
    ).toEqual(['one']);
  });

  it('should return examples for composed schema', async () => {
    expect(
      getExamplesForSchema({
        examples: ['one'],
        allOf: [
          {
            examples: ['two'],
          },
        ],
        oneOf: [
          {
            examples: ['three'],
          },
        ],
        anyOf: [
          {
            examples: ['four'],
          },
        ],
      }).sort()
    ).toEqual(['four', 'three', 'two', 'one'].sort());
  });

  it('should return examples for deeply composed schema', async () => {
    expect(
      getExamplesForSchema({
        examples: ['one'],
        allOf: [
          {
            examples: ['two'],
            oneOf: [
              {
                examples: ['three'],
                anyOf: [
                  {
                    examples: ['four'],
                  },
                ],
              },
            ],
          },
        ],
      }).sort()
    ).toEqual(['four', 'three', 'two', 'one'].sort());
  });

  it('should return examples for deeply composed schema', async () => {
    expect(
      getExamplesForSchema({
        examples: ['one'],
        allOf: [
          {
            examples: ['two'],
            oneOf: [
              {
                examples: ['three'],
                anyOf: [
                  {
                    examples: ['four'],
                  },
                ],
              },
            ],
          },
        ],
      }).sort()
    ).toEqual(['four', 'three', 'two', 'one'].sort());
  });

  it('should aggregate examples for any mixture of schemas with `example` and `examples`', async () => {
    expect(
      getExamplesForSchema({
        examples: ['one'],
        allOf: [
          {
            example: 'two',
            oneOf: [
              {
                examples: ['three'],
                anyOf: [
                  {
                    example: 'four',
                  },
                ],
              },
            ],
          },
        ],
      }).sort()
    ).toEqual(['four', 'three', 'two', 'one'].sort());
  });

  it('should de-duplicate primitive examples for composed schema', async () => {
    expect(
      getExamplesForSchema({
        examples: ['one'],
        allOf: [
          {
            examples: ['one'],
          },
        ],
      })
    ).toEqual(['one']);
  });

  it('should not deduplicate non-primitive examples for composed schema', async () => {
    expect(
      getExamplesForSchema({
        examples: [{}],
        allOf: [
          {
            examples: [{}],
          },
        ],
      })
    ).toEqual([{}, {}]);
  });
});
