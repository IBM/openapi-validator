/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { pathMatchesRegexp } = require('../../src/utils');

describe('Test pathMatchesRegexp() function', () => {
  it('Positive tests', () => {
    const path1 = [
      'paths',
      '/v1/drinks',
      'get',
      'responses',
      '200',
      'content',
      'application/json',
      'schema',
    ];
    const path2 = ['components', 'schemas', 'Foo', 'properties', 'foo_prop'];
    const path3 = [
      'components',
      'schemas',
      'Foo',
      'allOf',
      '0',
      'properties',
      'foo_prop',
    ];
    const path4 = [
      'components',
      'requestBodies',
      'FooRequest',
      'content',
      'application/json',
      'schema',
    ];
    const path5 = ['paths', '/v1/drinks', 'get', 'parameters', '0', 'schema'];

    // Does path refer to a schema object?
    // Regexp flavor
    expect(pathMatchesRegexp(path1, /^.*,schema$/)).toBe(true);
    // String flavor
    expect(pathMatchesRegexp(path1, '^.*,schema$')).toBe(true);

    // Does path refer to a schema within a JSON success response?
    // Regexp flavor
    expect(
      pathMatchesRegexp(
        path1,
        /^.*,responses,2\d+,content,application\/json,schema$/
      )
    ).toBe(true);
    // String flavor
    expect(
      pathMatchesRegexp(
        path1,
        '^.*,responses,2\\d+,content,application/json,schema$'
      )
    ).toBe(true);

    // Does path refer to a schema property named 'foo_prop'?
    expect(pathMatchesRegexp(path2, /^.*,properties,foo_prop$/)).toBe(true);

    // Does path refer to a schema property with any name?
    expect(pathMatchesRegexp(path2, /^.*,properties,[^,]+$/)).toBe(true);

    // Does path refer to a property within a schema used in an allOf list?
    // Regexp flavor
    expect(pathMatchesRegexp(path3, /^.*,allOf,\d+,properties,[^,]*$/)).toBe(
      true
    );
    // String flavor
    expect(pathMatchesRegexp(path3, '^.*,allOf,\\d+,properties,[^,]*$')).toBe(
      true
    );

    // Does path refer to a property within a schema used in a oneOf list?
    expect(pathMatchesRegexp(path3, /^.*,oneOf,\d+,properties,[^,]*$/)).toBe(
      false
    );

    // Does path refer to a schema used in a json entry within any content object?
    expect(
      pathMatchesRegexp(path4, /^.*,content,application\/json,schema$/)
    ).toBe(true);

    // Does path refer to a schema not associated with a parameter object?
    expect(pathMatchesRegexp(path1, /^.*(?<!,parameters,\d+),schema$/)).toBe(
      true
    );
    expect(pathMatchesRegexp(path5, /^.*(?<!,parameters,\d+),schema$/)).toBe(
      false
    );
  });

  it('Negative tests', () => {
    function passNonArrayPath() {
      pathMatchesRegexp('this is not an array', /^.*,schema$/);
    }
    function passBadRegexp() {
      pathMatchesRegexp(['components', 'schemas', 'Foo'], 0);
    }

    expect(passNonArrayPath).toThrowError('argument "path" must be an array!');
    expect(passBadRegexp).toThrowError(
      'argument "regexp" must be a string or RegExp instance!'
    );
  });
});
