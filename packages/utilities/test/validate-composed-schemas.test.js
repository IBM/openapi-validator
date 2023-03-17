/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { validateComposedSchemas } = require('../src');

describe('Utility function: validateComposedSchemas()', () => {
  it('should validate a simple schema by default', async () => {
    const simpleSchema = {};

    const visitedPaths = validateComposedSchemas(simpleSchema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths).toEqual(['']);
  });

  it('should not validate a simple schema if `includeSelf` is `false`', async () => {
    const schema = {};

    const visitedPaths = validateComposedSchemas(
      schema,
      [],
      (s, p) => {
        return [p.join('.')];
      },
      false
    );

    expect(visitedPaths).toEqual([]);
  });

  it('should validate a composed schema even if `includeSelf` is `false`', async () => {
    const schema = {
      allOf: [{}],
    };

    const visitedPaths = validateComposedSchemas(
      schema,
      [],
      (s, p) => {
        return [p.join('.')];
      },
      false
    );

    expect(visitedPaths).toEqual(['allOf.0']);
  });

  it('should validate `allOf` schemas', async () => {
    const schema = {
      allOf: [{}, {}],
    };

    const visitedPaths = validateComposedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(['', 'allOf.0', 'allOf.1'].sort());
  });

  it('should validate `oneOf` schemas', async () => {
    const schema = {
      oneOf: [{}, {}],
    };

    const visitedPaths = validateComposedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(['', 'oneOf.0', 'oneOf.1'].sort());
  });

  it('should validate `anyOf` schemas', async () => {
    const schema = {
      anyOf: [{}, {}],
    };

    const visitedPaths = validateComposedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(['', 'anyOf.0', 'anyOf.1'].sort());
  });

  it('should validate `not` schema', async () => {
    const schema = {
      not: {},
    };

    const visitedPaths = validateComposedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(['', 'not'].sort());
  });

  it('should not validate `not` schema if `includeNot` is false', async () => {
    const schema = {
      not: {},
    };

    const visitedPaths = validateComposedSchemas(
      schema,
      [],
      (s, p) => {
        return [p.join('.')];
      },
      true,
      false
    );

    expect(visitedPaths).toEqual(['']);
  });

  it('should recurse through `allOf`, `oneOf`, `anyOf`, and `not`', async () => {
    const schema = {
      allOf: [{ oneOf: [{ anyOf: [{ not: {} }] }] }],
    };

    const visitedPaths = validateComposedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(
      [
        '',
        'allOf.0',
        'allOf.0.oneOf.0',
        'allOf.0.oneOf.0.anyOf.0',
        'allOf.0.oneOf.0.anyOf.0.not',
      ].sort()
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

    const visitedPaths = validateComposedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths).toEqual(['']);
  });

  it('should not validate `additionalProperties` schema', async () => {
    const schema = {
      additionalProperties: {},
    };

    const visitedPaths = validateComposedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths).toEqual(['']);
  });

  it('should not validate `items` schema', async () => {
    const schema = {
      items: {},
    };

    const visitedPaths = validateComposedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths).toEqual(['']);
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

    const visitedPaths = validateComposedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(['', 'allOf.1'].sort());
  });
});
