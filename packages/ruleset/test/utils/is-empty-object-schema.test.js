/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isEmptyObjectSchema } = require('../../src/utils');

describe('Utility function: isEmptyObjectSchema()', () => {
  describe('Should return false', () => {
    it('`undefined` schema', async () => {
      expect(isEmptyObjectSchema(undefined)).toBe(false);
    });

    it('`null` schema', async () => {
      expect(isEmptyObjectSchema(null)).toBe(false);
    });

    it('an array (not a schema)', async () => {
      expect(isEmptyObjectSchema([])).toBe(false);
    });

    it('any type schema', async () => {
      expect(isEmptyObjectSchema({})).toBe(false);
    });

    it('string schema', async () => {
      expect(isEmptyObjectSchema({ type: 'string' })).toBe(false);
    });

    it('empty allOf list', async () => {
      const s = {
        allOf: [],
      };
      expect(isEmptyObjectSchema(s)).toBe(false);
    });

    it('empty anyOf list', async () => {
      const s = {
        anyOf: [],
      };
      expect(isEmptyObjectSchema(s)).toBe(false);
    });

    it('empty oneOf list', async () => {
      const s = {
        oneOf: [],
      };
      expect(isEmptyObjectSchema(s)).toBe(false);
    });

    it('non-empty object schema', async () => {
      const s = {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
          },
        },
      };
      expect(isEmptyObjectSchema(s)).toBe(false);
    });

    it('empty object schema w/extra field', async () => {
      const s = {
        type: 'object',
        description: 'almost empty object schema',
        additionalProperties: true,
        minLength: 1,
      };
      expect(isEmptyObjectSchema(s)).toBe(false);
    });

    it('additionalProperties is explicitly false', async () => {
      const s = {
        type: 'object',
        description: 'nearly an object schema',
        additionalProperties: false,
      };
      expect(isEmptyObjectSchema(s)).toBe(false);
    });
  });

  describe('Should return true', () => {
    it('empty object schema w/all allowable fields', async () => {
      const s = {
        type: 'object',
        description: 'empty object schema',
        additionalProperties: true,
      };
      expect(isEmptyObjectSchema(s)).toBe(true);
    });

    it('empty object schema w/only type', async () => {
      const s = {
        type: 'object',
      };
      expect(isEmptyObjectSchema(s)).toBe(true);
    });

    it('empty object schema w/only type,description', async () => {
      const s = {
        type: 'object',
        description: 'empty object schema',
      };
      expect(isEmptyObjectSchema(s)).toBe(true);
    });

    it('empty object schema w/annotations', async () => {
      const s = {
        'type': 'object',
        'description': 'empty object schema',
        'x-foo': 'bar',
      };
      expect(isEmptyObjectSchema(s)).toBe(true);
    });
  });
});
