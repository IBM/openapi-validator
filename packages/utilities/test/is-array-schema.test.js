/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isArraySchema } = require('../src');

describe('Utility function: isArraySchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isArraySchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isArraySchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isArraySchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isArraySchema({})).toBe(false);
  });

  it('should return `true` for an object with `type` of "array"', async () => {
    expect(isArraySchema({ type: 'array' })).toBe(true);
  });

  it('should return `true` if `type` contains "array"', async () => {
    expect(isArraySchema({ type: ['array'] })).toBe(true);
  });

  it('should return `true` for an object with no `type` and an `items` object', async () => {
    expect(isArraySchema({ items: {} })).toBe(true);
  });

  it('should return `false` for an object with non-"array" `type` and an `items` object', async () => {
    expect(isArraySchema({ type: 'object', items: {} })).toBe(false);
  });

  it('should return `false` for an object with no `type` and a non-object `items`', async () => {
    expect(isArraySchema({ items: null })).toBe(false);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isArraySchema({
        oneOf: [
          {
            allOf: [{ anyOf: [{ items: {} }, { type: 'array' }] }, {}],
          },
          { type: 'array' },
        ],
      })
    ).toBe(true);
    expect(
      isArraySchema({
        oneOf: [
          {
            allOf: [{ anyOf: [{ items: {} }, { type: ['array'] }] }, {}],
          },
          { type: ['array'] },
        ],
      })
    ).toBe(true);
  });
});
