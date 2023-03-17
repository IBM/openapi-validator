/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isIntegerSchema } = require('../src');

describe('Utility function: isIntegerSchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isIntegerSchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isIntegerSchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isIntegerSchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isIntegerSchema({})).toBe(false);
  });

  it('should return `true` for an object with `type` of "integer"', async () => {
    expect(isIntegerSchema({ type: 'integer' })).toBe(true);
  });

  // Skipped: debatable whether this test ought to pass, but maybe for OAS 3.1 support
  it.skip('should return `true` for an object with `type` of ["integer"]', async () => {
    expect(isIntegerSchema({ type: ['integer'] })).toBe(true);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isIntegerSchema({
        oneOf: [
          {
            allOf: [{ anyOf: [{ type: 'integer' }, { type: 'integer' }] }, {}],
          },
          { type: 'integer' },
        ],
      })
    ).toBe(true);
  });
});
