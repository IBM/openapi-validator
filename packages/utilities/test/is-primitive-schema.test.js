/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isPrimitiveSchema } = require('../src');

describe('Utility function: isPrimitiveSchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isPrimitiveSchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isPrimitiveSchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isPrimitiveSchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isPrimitiveSchema({})).toBe(false);
  });

  it('should return `true` for a boolean schema', async () => {
    expect(isPrimitiveSchema({ type: 'boolean' })).toBe(true);
  });

  it('should return `true` for a byte schema', async () => {
    expect(isPrimitiveSchema({ type: 'string', format: 'byte' })).toBe(true);
  });

  it('should return `true` for a double schema', async () => {
    expect(isPrimitiveSchema({ type: 'number', format: 'double' })).toBe(true);
  });

  it('should return `true` for an enumeration', async () => {
    expect(isPrimitiveSchema({ type: 'string', enum: ['foo', 'bar'] })).toBe(
      true
    );
  });

  it('should return `true` for a float schema', async () => {
    expect(isPrimitiveSchema({ type: 'number', format: 'float' })).toBe(true);
  });

  it('should return `true` for a int32 schema', async () => {
    expect(isPrimitiveSchema({ type: 'integer', format: 'int32' })).toBe(true);
  });

  it('should return `true` for a int64 schema', async () => {
    expect(isPrimitiveSchema({ type: 'integer', format: 'int64' })).toBe(true);
  });

  it('should return `true` for a integer schema', async () => {
    expect(isPrimitiveSchema({ type: 'integer' })).toBe(true);
  });

  it('should return `true` for a number schema', async () => {
    expect(isPrimitiveSchema({ type: 'number' })).toBe(true);
  });

  it('should return `true` for a string schema', async () => {
    expect(isPrimitiveSchema({ type: 'string' })).toBe(true);
  });

  it('should return true for a composed schema that resolves to "int32"', async () => {
    expect(
      isPrimitiveSchema({
        oneOf: [
          {
            allOf: [
              {
                anyOf: [
                  { type: 'integer', format: 'int32' },
                  { type: 'integer', format: 'int32' },
                ],
              },
              {},
            ],
          },
          { type: 'integer', format: 'int32' },
        ],
      })
    ).toBe(true);
  });

  it('should return true for a composed schema that resolves to "double"', async () => {
    expect(
      isPrimitiveSchema({
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

  it('should return true for a composed schema that resolves to "number"', async () => {
    expect(
      isPrimitiveSchema({
        oneOf: [
          {
            allOf: [{ anyOf: [{ type: 'number' }, { type: 'number' }] }, {}],
          },
          { type: 'number' },
        ],
      })
    ).toBe(true);
  });

  it('should return true for a composed schema that resolves to "boolean"', async () => {
    expect(
      isPrimitiveSchema({
        oneOf: [
          {
            allOf: [{ anyOf: [{ type: 'boolean' }, { type: 'boolean' }] }, {}],
          },
          { type: 'boolean' },
        ],
      })
    ).toBe(true);
  });

  it('should return true for a composed schema that resolves to "string"', async () => {
    expect(
      isPrimitiveSchema({
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
