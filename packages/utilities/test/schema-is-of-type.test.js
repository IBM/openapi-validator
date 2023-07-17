/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { schemaIsOfType } = require('../src');

describe('Utility function: schemaIsOfType()', () => {
  describe('Should return true', () => {
    it('single type: null', async () => {
      expect(schemaIsOfType({ type: 'null' }, 'null')).toBe(true);
    });
    it('single type: boolean', async () => {
      expect(schemaIsOfType({ type: 'boolean' }, 'boolean')).toBe(true);
    });
    it('single type: string', async () => {
      expect(schemaIsOfType({ type: 'string' }, 'string')).toBe(true);
    });
    it('single type: number', async () => {
      expect(schemaIsOfType({ type: 'number' }, 'number')).toBe(true);
    });
    it('single type: integer', async () => {
      expect(schemaIsOfType({ type: 'integer' }, 'integer')).toBe(true);
    });
    it('single type: object', async () => {
      expect(schemaIsOfType({ type: 'object' }, 'object')).toBe(true);
    });
    it('single type: array', async () => {
      expect(schemaIsOfType({ type: 'array' }, 'array')).toBe(true);
    });

    it('multiple types: null', async () => {
      expect(
        schemaIsOfType({ type: ['array', 'string', 'null'] }, 'null')
      ).toBe(true);
    });
    it('multiple types: boolean', async () => {
      expect(
        schemaIsOfType({ type: ['string', 'null', 'boolean'] }, 'boolean')
      ).toBe(true);
    });
    it('multiple types: string', async () => {
      expect(
        schemaIsOfType({ type: ['string', 'null', 'boolean'] }, 'string')
      ).toBe(true);
    });
    it('multiple types: number', async () => {
      expect(
        schemaIsOfType({ type: ['string', 'number', 'boolean'] }, 'number')
      ).toBe(true);
    });
    it('multiple types: integer', async () => {
      expect(
        schemaIsOfType({ type: ['string', 'null', 'integer'] }, 'integer')
      ).toBe(true);
    });
    it('multiple types: object', async () => {
      expect(
        schemaIsOfType({ type: ['string', 'object', 'boolean'] }, 'object')
      ).toBe(true);
    });
    it('multiple types: array', async () => {
      expect(schemaIsOfType({ type: ['string', 'array'] }, 'array')).toBe(true);
    });
  });
  describe('Should return false', () => {
    it('single type: not null', async () => {
      expect(schemaIsOfType({ type: 'string' }, 'null')).toBe(false);
    });
    it('single type: not boolean', async () => {
      expect(schemaIsOfType({ type: 'string' }, 'boolean')).toBe(false);
    });
    it('single type: not string', async () => {
      expect(schemaIsOfType({ type: 'integer' }, 'string')).toBe(false);
    });
    it('single type: not number', async () => {
      expect(schemaIsOfType({ type: 'array' }, 'number')).toBe(false);
    });
    it('single type: not integer', async () => {
      expect(schemaIsOfType({ type: 'number' }, 'integer')).toBe(false);
    });
    it('single type: not object', async () => {
      expect(schemaIsOfType({ type: 'array' }, 'object')).toBe(false);
    });
    it('single type: not array', async () => {
      expect(schemaIsOfType({ type: 'object' }, 'array')).toBe(false);
    });

    it('multiple types: not null', async () => {
      expect(schemaIsOfType({ type: ['array', 'string'] }, 'null')).toBe(false);
    });
    it('multiple types: not boolean', async () => {
      expect(schemaIsOfType({ type: ['null', 'string'] }, 'boolean')).toBe(
        false
      );
    });
    it('multiple types: not string', async () => {
      expect(schemaIsOfType({ type: ['array', 'boolean'] }, 'string')).toBe(
        false
      );
    });
    it('multiple types: not number', async () => {
      expect(schemaIsOfType({ type: ['object', 'array'] }, 'number')).toBe(
        false
      );
    });
    it('multiple types: not integer', async () => {
      expect(schemaIsOfType({ type: ['number', 'boolean'] }, 'integer')).toBe(
        false
      );
    });
    it('multiple types: not object', async () => {
      expect(schemaIsOfType({ type: ['array', 'null'] }, 'object')).toBe(false);
    });
    it('multiple types: not array', async () => {
      expect(
        schemaIsOfType(
          {
            type: ['null', 'string', 'integer', 'number', 'object', 'boolean'],
          },
          'array'
        )
      ).toBe(false);
    });
  });
});
