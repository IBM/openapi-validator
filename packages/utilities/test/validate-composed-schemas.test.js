/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { validateComposedSchemas } = require('../src');
const SchemaPath = require('../src/utils/schema-path');

describe('Utility function: validateComposedSchemas()', () => {
  it('should validate a simple schema by default', async () => {
    const schema = {};

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(schema, [], (s, p) => {
      visitedPaths.push(p.join('.'));
      return [index++];
    });

    expect(visitedPaths).toEqual(['']);
    expect(results).toEqual([1]);
  });

  it('should not validate a simple schema if `includeSelf` is `false`', async () => {
    const schema = {};

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(
      schema,
      [],
      (s, p) => {
        visitedPaths.push(p.join('.'));
        return [index++];
      },
      false
    );

    expect(visitedPaths).toEqual([]);
    expect(results).toEqual([]);
  });

  it('should validate a composed schema even if `includeSelf` is `false`', async () => {
    const schema = {
      allOf: [{}],
    };

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(
      schema,
      [],
      (s, p) => {
        visitedPaths.push(p.join('.'));
        return [index++];
      },
      false
    );

    expect(visitedPaths).toEqual(['allOf.0']);
    expect(results).toEqual([1]);
  });

  it('should validate `allOf` schemas', async () => {
    const schema = {
      allOf: [{}, {}],
    };

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(schema, [], (s, p) => {
      visitedPaths.push(p.join('.'));
      return [index++];
    });

    expect(visitedPaths.sort()).toEqual(['', 'allOf.0', 'allOf.1']);
    expect(results.sort()).toEqual([1, 2, 3]);
  });

  it('should validate `oneOf` schemas', async () => {
    const schema = {
      oneOf: [{}, {}],
    };

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(schema, [], (s, p) => {
      visitedPaths.push(p.join('.'));
      return [index++];
    });

    expect(visitedPaths.sort()).toEqual(['', 'oneOf.0', 'oneOf.1']);
    expect(results.sort()).toEqual([1, 2, 3]);
  });

  it('should validate `anyOf` schemas', async () => {
    const schema = {
      anyOf: [{}, {}],
    };

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(schema, [], (s, p) => {
      visitedPaths.push(p.join('.'));
      return [index++];
    });

    expect(visitedPaths.sort()).toEqual(['', 'anyOf.0', 'anyOf.1']);
    expect(results.sort()).toEqual([1, 2, 3]);
  });

  it('should validate `not` schema', async () => {
    const schema = {
      not: {},
    };

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(schema, [], (s, p) => {
      visitedPaths.push(p.join('.'));
      return [index++];
    });

    expect(visitedPaths.sort()).toEqual(['', 'not']);
    expect(results.sort()).toEqual([1, 2]);
  });

  it('should not validate `not` schema if `includeNot` is false', async () => {
    const schema = {
      not: {},
    };

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(
      schema,
      [],
      (s, p) => {
        visitedPaths.push(p.join('.'));
        return [index++];
      },
      true,
      false
    );

    expect(visitedPaths).toEqual(['']);
    expect(results).toEqual([1]);
  });

  it('should recurse through `allOf`, `oneOf`, `anyOf`, and `not`', async () => {
    const schema = {
      allOf: [{ oneOf: [{ anyOf: [{ not: {} }] }] }],
    };

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(schema, [], (s, p) => {
      visitedPaths.push(p.join('.'));
      return [index++];
    });

    expect(visitedPaths.sort()).toEqual([
      '',
      'allOf.0',
      'allOf.0.oneOf.0',
      'allOf.0.oneOf.0.anyOf.0',
      'allOf.0.oneOf.0.anyOf.0.not',
    ]);
    expect(results.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('should validate a schema before validating its composed schemas', async () => {
    const schema = {
      allOf: [{ oneOf: [{ anyOf: [{ not: {} }] }] }],
    };

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(schema, [], (s, p) => {
      visitedPaths.push(p.join('.'));
      return [index++];
    });

    expect(visitedPaths).toEqual([
      '',
      'allOf.0',
      'allOf.0.oneOf.0',
      'allOf.0.oneOf.0.anyOf.0',
      'allOf.0.oneOf.0.anyOf.0.not',
    ]);
    expect(results).toEqual([1, 2, 3, 4, 5]);
  });

  it("should validate a schema's composition parent more recently than its parent's siblings", async () => {
    const schema = {
      allOf: [{ oneOf: [{}] }, { oneOf: [{}] }],
      oneOf: [{ anyOf: [{}] }, { anyOf: [{}] }],
      anyOf: [{ not: {} }, { not: {} }],
      not: { allOf: [{}] },
    };

    const visitedPaths = [];

    validateComposedSchemas(schema, [], (s, p) => {
      visitedPaths.push(p.join('.'));
      return [];
    });

    expect(visitedPaths.indexOf('allOf.0.oneOf.0') - 1).toEqual(
      visitedPaths.indexOf('allOf.0')
    );
    expect(visitedPaths.indexOf('allOf.1.oneOf.0') - 1).toEqual(
      visitedPaths.indexOf('allOf.1')
    );
    expect(visitedPaths.indexOf('oneOf.0.anyOf.0') - 1).toEqual(
      visitedPaths.indexOf('oneOf.0')
    );
    expect(visitedPaths.indexOf('oneOf.1.anyOf.0') - 1).toEqual(
      visitedPaths.indexOf('oneOf.1')
    );
    expect(visitedPaths.indexOf('anyOf.0.not') - 1).toEqual(
      visitedPaths.indexOf('anyOf.0')
    );
    expect(visitedPaths.indexOf('anyOf.1.not') - 1).toEqual(
      visitedPaths.indexOf('anyOf.1')
    );
    expect(visitedPaths.indexOf('not.allOf.0') - 1).toEqual(
      visitedPaths.indexOf('not')
    );
  });

  it('recorded paths are accurate for each schema', async () => {
    const schema = {
      allOf: [{ oneOf: [{ anyOf: [{ not: {} }] }] }],
    };

    function getObjectByPath(object, path) {
      while (path.length) {
        object = object[path.shift()];
      }

      return object;
    }

    validateComposedSchemas(schema, [], (s, p) => {
      expect(s).toBe(getObjectByPath(schema, [...p]));

      return [];
    });
  });

  it('should not validate `properties` schemas', async () => {
    const schema = {
      properties: {
        one: {},
        two: {},
        three: {},
      },
    };

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(
      schema,
      [],
      (s, p) => {
        visitedPaths.push(p.join('.'));
        return [index++];
      },
      true,
      false
    );

    expect(visitedPaths).toEqual(['']);
    expect(results).toEqual([1]);
  });

  it('should not validate `additionalProperties` schema', async () => {
    const schema = {
      additionalProperties: {},
    };

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(
      schema,
      [],
      (s, p) => {
        visitedPaths.push(p.join('.'));
        return [index++];
      },
      true,
      false
    );

    expect(visitedPaths).toEqual(['']);
    expect(results).toEqual([1]);
  });

  it('should not validate `items` schema', async () => {
    const schema = {
      items: {},
    };

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(
      schema,
      [],
      (s, p) => {
        visitedPaths.push(p.join('.'));
        return [index++];
      },
      true,
      false
    );

    expect(visitedPaths).toEqual(['']);
    expect(results).toEqual([1]);
  });

  it('should skip schemas defined by a $ref', async () => {
    const schema = {
      allOf: [
        {
          $ref: '#/components/schemas/SomeSchema',
        },
        {},
      ],
    };

    const visitedPaths = [];
    let index = 1;

    const results = validateComposedSchemas(
      schema,
      [],
      (s, p) => {
        visitedPaths.push(p.join('.'));
        return [index++];
      },
      true,
      false
    );

    expect(visitedPaths.sort()).toEqual(['', 'allOf.1']);
    expect(results.sort()).toEqual([1, 2]);
  });

  // internal-only functionality
  it('should preserve the logical path with which it is called', async () => {
    const schema = {};

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateComposedSchemas(
      schema,
      new SchemaPath([], ['foo']),
      (s, p, lp) => {
        visitedPaths.push(p.join('.'));
        visitedLogicalPaths.push(lp.join('.'));
        return [index++];
      }
    );

    expect(visitedPaths).toEqual(['']);
    expect(visitedLogicalPaths).toEqual(['foo']);
    expect(results).toEqual([1]);
  });
});
