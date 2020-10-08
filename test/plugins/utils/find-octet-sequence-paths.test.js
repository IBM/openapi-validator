const expect = require('expect');
const findOctetSequencePaths = require('../../../src/plugins/utils/findOctetSequencePaths')
  .findOctetSequencePaths;

function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

describe('falsy values should return an empty array', function() {
  describe('undefined should return an empty array', function() {
    it('undefined is falsy', function() {
      expect(arrayEquals(findOctetSequencePaths(undefined, []), []));
    });
  });

  describe('null should return an empty array', function() {
    it('null is falsy', function() {
      expect(arrayEquals(findOctetSequencePaths(null, []), []));
    });
  });

  describe('NaN should return an empty array', function() {
    it('NaN is falsy', function() {
      expect(arrayEquals(findOctetSequencePaths(NaN, []), []));
    });
  });

  describe('0 should return an empty array', function() {
    it('0 is falsy', function() {
      expect(arrayEquals(findOctetSequencePaths(0, []), []));
    });
  });

  describe('The Empty String should return an empty array', function() {
    it('The Empty String is falsy', function() {
      expect(arrayEquals(findOctetSequencePaths('', []), []));
    });
  });

  describe('false should return an empty array', function() {
    it('false is falsy', function() {
      expect(findOctetSequencePaths(false, [])).toEqual([]);
    });
  });
});

describe('binary format string schemas should return the passed path', function() {
  describe('binary format strings should include the path in string form', function() {
    it('should return an array with string elements', function() {
      const schemaObj = { type: 'string', format: 'binary' };
      const path = ['path1.get'];

      expect(arrayEquals(findOctetSequencePaths(schemaObj, path), path));
    });
  });
});

describe('array-type schemas must extract values from the resolved schema', function() {
  describe('', function() {});
});
