/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isBooleanSchema } = require('../src');

describe('Utility function: isBooleanSchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isBooleanSchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isBooleanSchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isBooleanSchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isBooleanSchema({})).toBe(false);
  });

  it('should return `true` for an object with `type` of "boolean"', async () => {
    expect(isBooleanSchema({ type: 'boolean' })).toBe(true);
  });

  // Skipped: debatable whether this test ought to pass, but maybe for OAS 3.1 support
  it.skip('should return `true` for an object with `type` of ["boolean"]', async () => {
    expect(isBooleanSchema({ type: ['boolean'] })).toBe(true);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isBooleanSchema({
        oneOf: [
          {
            allOf: [{ anyOf: [{ type: 'boolean' }, { type: 'boolean' }] }, {}],
          },
          { type: 'boolean' },
        ],
      })
    ).toBe(true);
  });
});
