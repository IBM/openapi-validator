/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isDateSchema } = require('../src');

describe('Utility function: isDateSchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isDateSchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isDateSchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isDateSchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isDateSchema({})).toBe(false);
  });

  it('should return `false` for an object with `type` of `string` and no `format` value', async () => {
    expect(isDateSchema({ type: 'string' })).toBe(false);
  });

  it('should return `true` for an object with `type` of `string` and `format` of `date`', async () => {
    expect(isDateSchema({ type: 'string', format: 'date' })).toBe(true);
  });

  // Skipped: debatable whether this test ought to pass, but maybe for OAS 3.1 support
  it.skip('should return `true` for an object with `type` of ["string"] and `format` of `date`', async () => {
    expect(isDateSchema({ type: ['string'], format: 'date' })).toBe(true);
  });

  it('should return `false` for a composed schema with `type` and `format` defined separately', async () => {
    expect(
      isDateSchema({ allOf: [{ type: 'string' }, { format: 'date' }] })
    ).toBe(false);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isDateSchema({
        oneOf: [
          {
            allOf: [
              {
                anyOf: [
                  { type: 'string', format: 'date' },
                  { type: 'string', format: 'date' },
                ],
              },
              {},
            ],
          },
          { type: 'string', format: 'date' },
        ],
      })
    ).toBe(true);
  });
});
