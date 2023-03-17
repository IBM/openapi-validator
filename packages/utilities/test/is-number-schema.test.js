/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isNumberSchema } = require('../src');

describe('Utility function: isNumberSchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isNumberSchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isNumberSchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isNumberSchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isNumberSchema({})).toBe(false);
  });

  it('should return `true` for an object with `type` of "number"', async () => {
    expect(isNumberSchema({ type: 'number' })).toBe(true);
  });

  // Skipped: debatable whether this test ought to pass, but maybe for OAS 3.1 support
  it.skip('should return `true` for an object with `type` of ["number"]', async () => {
    expect(isNumberSchema({ type: ['number'] })).toBe(true);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isNumberSchema({
        oneOf: [
          {
            allOf: [{ anyOf: [{ type: 'number' }, { type: 'number' }] }, {}],
          },
          { type: 'number' },
        ],
      })
    ).toBe(true);
  });
});
