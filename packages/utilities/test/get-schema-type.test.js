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
  describe('type is a string', () => {
    it('type=array (ARRAY)', async () => {
      expect(getSchemaType({ type: 'array' })).toBe(SchemaType.ARRAY);
    });
    it('type=boolean (BOOLEAN)', async () => {
      expect(getSchemaType({ type: 'boolean' })).toBe(SchemaType.BOOLEAN);
    });
    it('type=string, format=date (DATE)', async () => {
      expect(getSchemaType({ type: 'string', format: 'date' })).toBe(
        SchemaType.DATE
      );
    });
    it('type=string, format=date-time (DATE_TIME)', async () => {
      expect(getSchemaType({ type: 'string', format: 'date-time' })).toBe(
        SchemaType.DATE_TIME
      );
    });
    it('type=number, format=double (DOUBLE)', async () => {
      expect(getSchemaType({ type: 'number', format: 'double' })).toBe(
        SchemaType.DOUBLE
      );
    });
    it('type=string, enum present (ENUMERATION)', async () => {
      expect(getSchemaType({ type: 'string', enum: ['one', 'two'] })).toBe(
        SchemaType.ENUMERATION
      );
    });
    it('type=number, format=float (FLOAT)', async () => {
      expect(getSchemaType({ type: 'number', format: 'float' })).toBe(
        SchemaType.FLOAT
      );
    });
    it('type=integer, format=int32 (INT32)', async () => {
      expect(getSchemaType({ type: 'integer', format: 'int32' })).toBe(
        SchemaType.INT32
      );
    });
    it('type=integer, format=int64 (INT64)', async () => {
      expect(getSchemaType({ type: 'integer', format: 'int64' })).toBe(
        SchemaType.INT64
      );
    });
    it('type=integer (INTEGER)', async () => {
      expect(getSchemaType({ type: 'integer' })).toBe(SchemaType.INTEGER);
    });

    it('type=number (NUMBER)', async () => {
      expect(getSchemaType({ type: 'number' })).toBe(SchemaType.NUMBER);
    });
    it('type=object (OBJECT)', async () => {
      expect(getSchemaType({ type: 'object' })).toBe(SchemaType.OBJECT);
    });
    it('type=string (STRING)', async () => {
      expect(getSchemaType({ type: 'string' })).toBe(SchemaType.STRING);
    });
  });

  describe('type is a list', () => {
    it('type contains array (ARRAY)', async () => {
      expect(getSchemaType({ type: ['array'] })).toBe(SchemaType.ARRAY);
    });

    it('type contains boolean (BOOLEAN)', async () => {
      expect(getSchemaType({ type: ['boolean'] })).toBe(SchemaType.BOOLEAN);
    });

    it('type contains string, format=date (DATE)', async () => {
      expect(getSchemaType({ type: ['string'], format: 'date' })).toBe(
        SchemaType.DATE
      );
    });

    it('type contains string, format=date-time (DATE_TIME)', async () => {
      expect(getSchemaType({ type: ['string'], format: 'date-time' })).toBe(
        SchemaType.DATE_TIME
      );
    });

    it('type contains number, format=double (DOUBLE)', async () => {
      expect(getSchemaType({ type: ['number'], format: 'double' })).toBe(
        SchemaType.DOUBLE
      );
    });

    it('type contains string, enum is present (ENUMERATION)', async () => {
      expect(getSchemaType({ type: ['string'], enum: ['one', 'two'] })).toBe(
        SchemaType.ENUMERATION
      );
    });

    it('type contains number, format=float (FLOAT)', async () => {
      expect(getSchemaType({ type: ['number'], format: 'float' })).toBe(
        SchemaType.FLOAT
      );
    });

    it('type contains integer, format=int32 (INT32)', async () => {
      expect(getSchemaType({ type: ['integer'], format: 'int32' })).toBe(
        SchemaType.INT32
      );
    });

    it('type contains integer, format=int64 (INT64)', async () => {
      expect(getSchemaType({ type: ['integer'], format: 'int64' })).toBe(
        SchemaType.INT64
      );
    });

    it('type contains integer (INTEGER)', async () => {
      expect(getSchemaType({ type: ['integer'] })).toBe(SchemaType.INTEGER);
    });

    it('type contains number (NUMBER)', async () => {
      expect(getSchemaType({ type: ['number'] })).toBe(SchemaType.NUMBER);
    });

    it('type contains object (OBJECT)', async () => {
      expect(getSchemaType({ type: ['object'] })).toBe(SchemaType.OBJECT);
    });

    it('type contains string (STRING)', async () => {
      expect(getSchemaType({ type: ['string'] })).toBe(SchemaType.STRING);
    });
  });
});
