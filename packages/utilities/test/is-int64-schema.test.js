/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isInt64Schema } = require('../src');

describe('Utility function: isInt64Schema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isInt64Schema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isInt64Schema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isInt64Schema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isInt64Schema({})).toBe(false);
  });

  it('should return `false` for an object with `type` of `integer` and no `format` value', async () => {
    expect(isInt64Schema({ type: 'integer' })).toBe(false);
  });

  it('should return `true` for an object with `type` of `integer` and `format` of `int64`', async () => {
    expect(isInt64Schema({ type: 'integer', format: 'int64' })).toBe(true);
  });

  // Skipped: debatable whether this test ought to pass, but maybe for OAS 3.1 support
  it.skip('should return `true` for an object with `type` of ["integer"] and `format` of `int64`', async () => {
    expect(isInt64Schema({ type: ['integer'], format: 'int64' })).toBe(true);
  });

  it('should return `false` for a composed schema with `type` and `format` defined separately', async () => {
    expect(
      isInt64Schema({ allOf: [{ type: 'integer' }, { format: 'int64' }] })
    ).toBe(false);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isInt64Schema({
        oneOf: [
          {
            allOf: [
              {
                anyOf: [
                  { type: 'integer', format: 'int64' },
                  { type: 'integer', format: 'int64' },
                ],
              },
              {},
            ],
          },
          { type: 'integer', format: 'int64' },
        ],
      })
    ).toBe(true);
  });
});
