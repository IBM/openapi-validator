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

describe('object-type schemas must extract values from the resolved schema', function() {
  const schemaObj = { type: 'object' };
  const path = ['path1.get'];
  it('falsy properties should not append to the path', function() {
    schemaObj.properties = false;

    expect(arrayEquals(findOctetSequencePaths(schemaObj, path), path));
  });

  it('truthy properties should be added to the octet paths', function() {
    schemaObj.properties = { one: { type: 'string', format: 'binary' } };
    const expectedOut = ['path1.get', 'path1.get.properties.one'];

    expect(arrayEquals(findOctetSequencePaths(schemaObj, path), expectedOut));
  });

  it('truthy properties should be recursively added to the octet paths', function() {
    schemaObj.properties = {
      one: {
        type: 'object',
        properties: { two: { type: 'string', format: 'binary' } }
      }
    };
    const expectedOut = [
      'path1.get',
      'path1.get.properties.one',
      'path1.get.properties.one.properties.two'
    ];

    expect(arrayEquals(findOctetSequencePaths(schemaObj, path), expectedOut));
  });
});

describe('array-type schemas require the proper values in proper fields', function() {
  const schemaObj = { type: 'array', items: null };

  it('should throw with a full path if the proper structure is not provided', function() {
    const path = ['path1.get'];

    expect(function() {
      findOctetSequencePaths(schemaObj, path);
    }).toThrow(
      'items.type and items.format must resolve for the path "path1.get"'
    );
  });

  it('should escape forward-slashes in the path', function() {
    const path = ['path1/get'];

    expect(function() {
      findOctetSequencePaths(schemaObj, path);
    }).toThrow(
      'items.type and items.format must resolve for the path "path1\\/get"'
    );
  });
});
