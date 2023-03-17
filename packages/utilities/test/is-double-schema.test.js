/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isDoubleSchema } = require('../src');

describe('Utility function: isDoubleSchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isDoubleSchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isDoubleSchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isDoubleSchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isDoubleSchema({})).toBe(false);
  });

  it('should return `false` for an object with `type` of `number` and no `format` value', async () => {
    expect(isDoubleSchema({ type: 'number' })).toBe(false);
  });

  it('should return `true` for an object with `type` of `number` and `format` of `double`', async () => {
    expect(isDoubleSchema({ type: 'number', format: 'double' })).toBe(true);
  });

  // Skipped: debatable whether this test ought to pass, but maybe for OAS 3.1 support
  it.skip('should return `true` for an object with `type` of ["number"] and `format` of `double`', async () => {
    expect(isDoubleSchema({ type: ['number'], format: 'double' })).toBe(true);
  });

  it('should return `false` for a composed schema with `type` and `format` defined separately', async () => {
    expect(
      isDoubleSchema({ allOf: [{ type: 'number' }, { format: 'double' }] })
    ).toBe(false);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isDoubleSchema({
        oneOf: [
          {
            allOf: [
              {
                anyOf: [
                  { type: 'number', format: 'double' },
                  { type: 'number', format: 'double' },
                ],
              },
              {},
            ],
          },
          { type: 'number', format: 'double' },
        ],
      })
    ).toBe(true);
  });
});
