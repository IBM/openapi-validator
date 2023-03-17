/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isStringSchema } = require('../src');

describe('Utility function: isStringSchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isStringSchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isStringSchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isStringSchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isStringSchema({})).toBe(false);
  });

  it('should return `true` for an object with `type` of "string"', async () => {
    expect(isStringSchema({ type: 'string' })).toBe(true);
  });

  // Skipped: debatable whether this test ought to pass, but maybe for OAS 3.1 support
  it.skip('should return `true` for an object with `type` of ["string"]', async () => {
    expect(isStringSchema({ type: ['string'] })).toBe(true);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isStringSchema({
        oneOf: [
          {
            allOf: [{ anyOf: [{ type: 'string' }, { type: 'string' }] }, {}],
          },
          { type: 'string' },
        ],
      })
    ).toBe(true);
  });
});
