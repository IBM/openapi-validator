/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isFloatSchema } = require('../src');

describe('Utility function: isFloatSchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isFloatSchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isFloatSchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isFloatSchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isFloatSchema({})).toBe(false);
  });

  it('should return `false` for an object with `type` of `number` and no `format` value', async () => {
    expect(isFloatSchema({ type: 'number' })).toBe(false);
  });

  it('should return `true` for an object with `type` of `number` and `format` of `float`', async () => {
    expect(isFloatSchema({ type: 'number', format: 'float' })).toBe(true);
  });

  // Skipped: debatable whether this test ought to pass, but maybe for OAS 3.1 support
  it.skip('should return `true` for an object with `type` of ["number"] and `format` of `float`', async () => {
    expect(isFloatSchema({ type: ['number'], format: 'float' })).toBe(true);
  });

  it('should return `false` for a composed schema with `type` and `format` defined separately', async () => {
    expect(
      isFloatSchema({ allOf: [{ type: 'number' }, { format: 'float' }] })
    ).toBe(false);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isFloatSchema({
        oneOf: [
          {
            allOf: [
              {
                anyOf: [
                  { type: 'number', format: 'float' },
                  { type: 'number', format: 'float' },
                ],
              },
              {},
            ],
          },
          { type: 'number', format: 'float' },
        ],
      })
    ).toBe(true);
  });
});
