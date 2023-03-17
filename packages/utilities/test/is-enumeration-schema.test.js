/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isEnumerationSchema } = require('../src');

describe('Utility function: isEnumerationSchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isEnumerationSchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isEnumerationSchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isEnumerationSchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isEnumerationSchema({})).toBe(false);
  });

  it('should return `true` for an object with `type` of `string` and an `enum` array of strings', async () => {
    expect(isEnumerationSchema({ type: 'string', enum: ['foo', 'bar'] })).toBe(
      true
    );
  });

  it('should return `false` for an object with no `type` and an `enum` array of strings', async () => {
    expect(isEnumerationSchema({ enum: ['foo', 'bar'] })).toBe(false);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isEnumerationSchema({
        oneOf: [
          {
            allOf: [
              {
                anyOf: [
                  { type: 'string', enum: ['one'] },
                  { type: 'string', enum: ['two'] },
                ],
              },
              {},
            ],
          },
          { type: 'string', enum: ['three'] },
        ],
      })
    ).toBe(true);
  });
});
