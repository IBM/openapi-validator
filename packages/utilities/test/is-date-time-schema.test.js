/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isDateTimeSchema } = require('../src');

describe('Utility function: isDateTimeSchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isDateTimeSchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isDateTimeSchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isDateTimeSchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isDateTimeSchema({})).toBe(false);
  });

  it('should return `false` for an object with `type` of `string` and no `format` value', async () => {
    expect(isDateTimeSchema({ type: 'string' })).toBe(false);
  });

  it('should return `true` for an object with `type` of `string` and `format` of `date-time`', async () => {
    expect(isDateTimeSchema({ type: 'string', format: 'date-time' })).toBe(
      true
    );
  });

  // Skipped: debatable whether this test ought to pass, but maybe for OAS 3.1 support
  it.skip('should return `true` for an object with `type` of ["string"] and `format` of `date-time`', async () => {
    expect(isDateTimeSchema({ type: ['string'], format: 'date' })).toBe(true);
  });

  it('should return `false` for a composed schema with `type` and `format` defined separately', async () => {
    expect(
      isDateTimeSchema({ allOf: [{ type: 'string' }, { format: 'date' }] })
    ).toBe(false);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isDateTimeSchema({
        oneOf: [
          {
            allOf: [
              {
                anyOf: [
                  { type: 'string', format: 'date-time' },
                  { type: 'string', format: 'date-time' },
                ],
              },
              {},
            ],
          },
          { type: 'string', format: 'date-time' },
        ],
      })
    ).toBe(true);
  });
});
