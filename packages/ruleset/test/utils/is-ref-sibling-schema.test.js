/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isRefSiblingSchema } = require('../../src/utils');

describe('Utility function: isRefSiblingSchema()', () => {
  describe('Should return false', () => {
    it('`undefined` schema', async () => {
      expect(isRefSiblingSchema(undefined)).toBe(false);
    });

    it('`null` schema', async () => {
      expect(isRefSiblingSchema(null)).toBe(false);
    });

    it('an array (not a schema)', async () => {
      expect(isRefSiblingSchema([])).toBe(false);
    });

    it('any type schema', async () => {
      expect(isRefSiblingSchema({})).toBe(false);
    });

    it('string schema', async () => {
      expect(isRefSiblingSchema({ type: 'string' })).toBe(false);
    });

    it('date schema', async () => {
      expect(isRefSiblingSchema({ type: 'string', format: 'date' })).toBe(
        false
      );
    });

    it('empty allOf list', async () => {
      const s = {
        allOf: [],
      };
      expect(isRefSiblingSchema(s)).toBe(false);
    });

    it('allOf[0] contains non-ref', async () => {
      const s = {
        allOf: [
          {
            description: 'non-ref schema',
          },
          {
            example: 'foo',
          },
        ],
      };
      expect(isRefSiblingSchema(s)).toBe(false);
    });

    it('allOf contains non-supported attribute', async () => {
      const s = {
        allOf: [
          {
            $ref: '#/components/schemas/Foo',
          },
          {
            minLength: 1,
          },
        ],
      };
      expect(isRefSiblingSchema(s)).toBe(false);
    });

    it('allOf with >2 elements', async () => {
      const s = {
        allOf: [
          {
            $ref: '#/components/schemas/Foo',
          },
          {
            description: 'this is starting to look like a ref-sibling',
          },
          {
            description: 'nope not a ref-sibling now',
          },
        ],
      };
      expect(isRefSiblingSchema(s)).toBe(false);
    });

    it('refSibling plus oneOf', async () => {
      const s = {
        allOf: [
          {
            $ref: '#/components/schemas/Foo',
          },
          {
            description: 'Overridden description',
          },
        ],
        oneOf: [],
      };
      expect(isRefSiblingSchema(s)).toBe(false);
    });

    it('refSibling plus anyOf', async () => {
      const s = {
        allOf: [
          {
            $ref: '#/components/schemas/Foo',
          },
          {
            description: 'Overridden description',
          },
        ],
        anyOf: [],
      };
      expect(isRefSiblingSchema(s)).toBe(false);
    });

    it('two-element allOf w/extra attributes', async () => {
      const s = {
        allOf: [
          {
            $ref: '#/components/schemas/Foo',
          },
          {
            description: 'Overridden description',
            nullable: true,
            example: 'foo',
            minProperties: 1,
          },
        ],
      };
      expect(isRefSiblingSchema(s)).toBe(false);
    });

    it('one-element allOf w/extra attributes', async () => {
      const s = {
        allOf: [
          {
            $ref: '#/components/schemas/Foo',
          },
        ],
        description: 'Overridden description',
        minProperties: 1,
      };
      expect(isRefSiblingSchema(s)).toBe(false);
    });

    it('one-element allOf w/no other attributes', async () => {
      const s = {
        allOf: [
          {
            $ref: '#/components/schemas/Foo',
          },
        ],
      };
      expect(isRefSiblingSchema(s)).toBe(false);
    });
  });

  describe('Should return true', () => {
    it('two-element allOf w/one supported attribute', async () => {
      const s = {
        allOf: [
          {
            $ref: '#/components/schemas/Foo',
          },
          {
            description: 'Overridden description',
          },
        ],
      };
      expect(isRefSiblingSchema(s)).toBe(true);
    });

    it('two-element allOf w/all supported attributes', async () => {
      const s = {
        allOf: [
          {
            $ref: '#/components/schemas/Foo',
          },
          {
            description: 'Overridden description',
            nullable: true,
            example: 'foo',
          },
        ],
      };
      expect(isRefSiblingSchema(s)).toBe(true);
    });

    it('one-element allOf w/one supported attribute', async () => {
      const s = {
        allOf: [
          {
            $ref: '#/components/schemas/Foo',
          },
        ],
        description: 'Overridden description',
      };
      expect(isRefSiblingSchema(s)).toBe(true);
    });

    it('one-element allOf w/all supported attributes', async () => {
      const s = {
        allOf: [
          {
            $ref: '#/components/schemas/Foo',
          },
        ],
        description: 'Overridden description',
        nullable: false,
        example: 'foo',
      };
      expect(isRefSiblingSchema(s)).toBe(true);
    });
  });
});
