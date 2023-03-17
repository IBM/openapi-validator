/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isByteSchema } = require('../src');

describe('Utility function: isByteSchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isByteSchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isByteSchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isByteSchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isByteSchema({})).toBe(false);
  });

  it('should return `false` for an object with `type` of `string` and no `format` value', async () => {
    expect(isByteSchema({ type: 'string' })).toBe(false);
  });

  it('should return `true` for an object with `type` of `string` and `format` of `byte`', async () => {
    expect(isByteSchema({ type: 'string', format: 'byte' })).toBe(true);
  });

  // Skipped: debatable whether this test ought to pass, but maybe for OAS 3.1 support
  it.skip('should return `true` for an object with `type` of ["string"] and `format` of `byte`', async () => {
    expect(isByteSchema({ type: ['string'], format: 'byte' })).toBe(true);
  });

  it('should return `false` for a composed schema with `type` and `format` defined separately', async () => {
    expect(
      isByteSchema({ allOf: [{ type: 'string' }, { format: 'byte' }] })
    ).toBe(false);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isByteSchema({
        oneOf: [
          {
            allOf: [
              {
                anyOf: [
                  { type: 'string', format: 'byte' },
                  { type: 'string', format: 'byte' },
                ],
              },
              {},
            ],
          },
          { type: 'string', format: 'byte' },
        ],
      })
    ).toBe(true);
  });
});
