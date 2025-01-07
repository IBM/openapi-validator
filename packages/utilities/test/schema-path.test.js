/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

// Necessary to get exceptions thrown for attempts to modify frozen objects
'use strict';

const SchemaPath = require('../src/utils/schema-path');

describe('Utility class: SchemaPath', () => {
  describe('physical path is preserved', () => {
    it('empty physical path is preserved', async () => {
      expect([...new SchemaPath([])]).toEqual([]);
    });
    it('empty physical path is preserved regardless of logical path', async () => {
      expect([...new SchemaPath([], ['foo', 'bar'])]).toEqual([]);
    });
    it('physical path is preserved', async () => {
      expect([...new SchemaPath(['one', 'two'])]).toEqual(['one', 'two']);
    });
    it('physical path is preserved regardless of logical path', async () => {
      expect([...new SchemaPath(['one', 'two'], ['foo', 'bar'])]).toEqual([
        'one',
        'two',
      ]);
    });
    it('physical path is immutable', async () => {
      const path = new SchemaPath(['one', 'two']);
      expect(() => path.push('three')).toThrow();
    });
  });
  describe('logical path is preserved', () => {
    it('logical path defaults to empty', async () => {
      expect(new SchemaPath(['one', 'two']).logical).toEqual([]);
    });
    it('empty logical path is preserved', async () => {
      expect(new SchemaPath(['one', 'two'], []).logical).toEqual([]);
    });
    it('logical path is preserved', async () => {
      expect(new SchemaPath(['one', 'two'], ['foo', 'bar']).logical).toEqual([
        'foo',
        'bar',
      ]);
    });
    it('logical path is immutable', async () => {
      const path = new SchemaPath(['one', 'two'], ['foo', 'bar']);
      expect(() => (path.logical = [])).toThrow();
      expect(() => path.logical.push('three')).toThrow();
    });
  });
  describe('withProperty()', () => {
    it('physical path is correctly appended', async () => {
      expect([
        ...new SchemaPath(['one', 'two'], ['foo', 'bar']).withProperty('three'),
      ]).toEqual(['one', 'two', 'properties', 'three']);
    });
    it('logical path is correctly appended', async () => {
      expect(
        new SchemaPath(['one', 'two'], ['foo', 'bar']).withProperty('three')
          .logical
      ).toEqual(['foo', 'bar', 'three']);
    });
  });
  describe('withAdditionalProperty()', () => {
    it('physical path is correctly appended', async () => {
      expect([
        ...new SchemaPath(
          ['one', 'two'],
          ['foo', 'bar']
        ).withAdditionalProperty(),
      ]).toEqual(['one', 'two', 'additionalProperties']);
    });
    it('logical path is correctly appended', async () => {
      expect(
        new SchemaPath(['one', 'two'], ['foo', 'bar']).withAdditionalProperty(
          'three'
        ).logical
      ).toEqual(['foo', 'bar', '*']);
    });
  });
  describe('withPatternProperty()', () => {
    it('physical path is correctly appended', async () => {
      expect([
        ...new SchemaPath(['one', 'two'], ['foo', 'bar']).withPatternProperty(
          'baz'
        ),
      ]).toEqual(['one', 'two', 'patternProperties', 'baz']);
    });
    it('logical path is correctly appended', async () => {
      expect(
        new SchemaPath(['one', 'two'], ['foo', 'bar']).withPatternProperty(
          'baz'
        ).logical
      ).toEqual(['foo', 'bar', '*']);
    });
  });
  describe('withArrayItem()', () => {
    it('physical path is correctly appended', async () => {
      expect([
        ...new SchemaPath(['one', 'two'], ['foo', 'bar']).withArrayItem(),
      ]).toEqual(['one', 'two', 'items']);
    });
    it('logical path is correctly appended', async () => {
      expect(
        new SchemaPath(['one', 'two'], ['foo', 'bar']).withArrayItem().logical
      ).toEqual(['foo', 'bar', '[]']);
    });
  });
  describe('withApplicator()', () => {
    it('physical path is correctly appended', async () => {
      expect([
        ...new SchemaPath(['one', 'two'], ['foo', 'bar']).withApplicator(
          'oneOf',
          '0'
        ),
      ]).toEqual(['one', 'two', 'oneOf', '0']);
    });
    it('logical path is correctly (not) appended', async () => {
      expect(
        new SchemaPath(['one', 'two'], ['foo', 'bar']).withApplicator(
          'oneOf',
          '0'
        ).logical
      ).toEqual(['foo', 'bar']);
    });
    it('numeric index is coerced to string', async () => {
      expect([
        ...new SchemaPath(['one', 'two'], ['foo', 'bar']).withApplicator(
          'oneOf',
          0
        ),
      ]).toEqual(['one', 'two', 'oneOf', '0']);
    });
  });
  describe('withNot()', () => {
    it('physical path is correctly appended', async () => {
      expect([
        ...new SchemaPath(['one', 'two'], ['foo', 'bar']).withNot(),
      ]).toEqual(['one', 'two', 'not']);
    });
    it('logical path is correctly (not) appended', async () => {
      expect(
        new SchemaPath(['one', 'two'], ['foo', 'bar']).withNot().logical
      ).toEqual(['foo', 'bar']);
    });
  });
});
