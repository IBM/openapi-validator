/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getSchemaType, SchemaType } = require('../src');

/*
 * Most of the behavior for this utility is better tested in its more specific dependencies,
 * so these tests are very limited.
 */
describe('Utility function: getSchemaType()', () => {
  it('should return `SchemaType.ARRAY` for `type` of `array`', async () => {
    expect(getSchemaType({ type: 'array' })).toBe(SchemaType.ARRAY);
  });

  it('should return `SchemaType.BOOLEAN` for `type` of `boolean`', async () => {
    expect(getSchemaType({ type: 'boolean' })).toBe(SchemaType.BOOLEAN);
  });

  it('should return `SchemaType.DATE` for `type` of `string` and `format` of `date`', async () => {
    expect(getSchemaType({ type: 'string', format: 'date' })).toBe(
      SchemaType.DATE
    );
  });

  it('should return `SchemaType.DATE_TIME` for `type` of `string` and `format` of `date-time`', async () => {
    expect(getSchemaType({ type: 'string', format: 'date-time' })).toBe(
      SchemaType.DATE_TIME
    );
  });

  it('should return `SchemaType.DOUBLE` for `type` of `number` and `format` of `double`', async () => {
    expect(getSchemaType({ type: 'number', format: 'double' })).toBe(
      SchemaType.DOUBLE
    );
  });

  it('should return `SchemaType.ENUMERATION` for `type` of `string` and an `enum` array of strings', async () => {
    expect(getSchemaType({ type: 'string', enum: ['one', 'two'] })).toBe(
      SchemaType.ENUMERATION
    );
  });

  it('should return `SchemaType.FLOAT` for `type` of `number` and `format` of `float`', async () => {
    expect(getSchemaType({ type: 'number', format: 'float' })).toBe(
      SchemaType.FLOAT
    );
  });

  it('should return `SchemaType.INT32` for `type` of `integer` and `format` of `int32`', async () => {
    expect(getSchemaType({ type: 'integer', format: 'int32' })).toBe(
      SchemaType.INT32
    );
  });

  it('should return `SchemaType.INT64` for `type` of `integer` and `format` of `int64`', async () => {
    expect(getSchemaType({ type: 'integer', format: 'int64' })).toBe(
      SchemaType.INT64
    );
  });

  it('should return `SchemaType.INTEGER` for `type` of `integer`', async () => {
    expect(getSchemaType({ type: 'integer' })).toBe(SchemaType.INTEGER);
  });

  it('should return `SchemaType.NUMBER` for `type` of `number`', async () => {
    expect(getSchemaType({ type: 'number' })).toBe(SchemaType.NUMBER);
  });

  it('should return `SchemaType.OBJECT` for `type` of `object`', async () => {
    expect(getSchemaType({ type: 'object' })).toBe(SchemaType.OBJECT);
  });

  it('should return `SchemaType.STRING` for `type` of `string`', async () => {
    expect(getSchemaType({ type: 'string' })).toBe(SchemaType.STRING);
  });
});
