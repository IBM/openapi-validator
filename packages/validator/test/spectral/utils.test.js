/**
 * Copyright 2026 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { splitMessage } = require('../../src/spectral/utils');

describe('Spectral utils tests', function () {
  describe('splitMessage', function () {
    it('should return the original message and null detail when no colon is present', function () {
      const result = splitMessage('Property must be a string');
      expect(result).toEqual({
        base: 'Property must be a string',
        detail: null,
      });
    });

    it('should split on colon followed by space', function () {
      const result = splitMessage('Base message: some detail');
      expect(result).toEqual({
        base: 'Base message',
        detail: 'some detail',
      });
    });

    it('should split on trailing colon with no detail', function () {
      const result = splitMessage('Base message:');
      expect(result).toEqual({
        base: 'Base message',
        detail: null,
      });
    });

    it('should not split on colons without whitespace such as in paths or URLs', function () {
      const urlResult = splitMessage(
        'See https://example.com/docs for details'
      );
      expect(urlResult).toEqual({
        base: 'See https://example.com/docs for details',
        detail: null,
      });

      const pathResult = splitMessage(
        "Collection schema for path '/v1/things:batch' should use the name: ThingCollection"
      );
      expect(pathResult).toEqual({
        base: "Collection schema for path '/v1/things:batch' should use the name",
        detail: 'ThingCollection',
      });
    });

    it('should only split on the first valid colon separator', function () {
      const result = splitMessage('First: Second: Third');
      expect(result).toEqual({
        base: 'First',
        detail: 'Second: Third',
      });
    });
  });
});
