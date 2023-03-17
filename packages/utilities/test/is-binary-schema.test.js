/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isBinarySchema } = require('../src');

describe('Utility function: isBinarySchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isBinarySchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isBinarySchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isBinarySchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isBinarySchema({})).toBe(false);
  });

  it('should return `false` for an object with `type` of `string` and no `format` value', async () => {
    expect(isBinarySchema({ type: 'string' })).toBe(false);
  });

  it('should return `true` for an object with `type` of `string` and `format` of `binary`', async () => {
    expect(isBinarySchema({ type: 'string', format: 'binary' })).toBe(true);
  });

  // Skipped: debatable whether this test ought to pass, but maybe for OAS 3.1 support
  it.skip('should return `true` for an object with `type` of ["string"] and `format` of `binary`', async () => {
    expect(isBinarySchema({ type: ['string'], format: 'binary' })).toBe(true);
  });

  it('should return `false` for a composed schema with `type` and `format` defined separately', async () => {
    expect(
      isBinarySchema({ allOf: [{ type: 'string' }, { format: 'binary' }] })
    ).toBe(false);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isBinarySchema({
        oneOf: [
          {
            allOf: [
              {
                anyOf: [
                  { type: 'string', format: 'binary' },
                  { type: 'string', format: 'binary' },
                ],
              },
              {},
            ],
          },
          { type: 'string', format: 'binary' },
        ],
      })
    ).toBe(true);
  });
});
