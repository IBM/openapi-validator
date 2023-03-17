/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { validateNestedSchemas } = require('../src');

describe('Utility function: validateNestedSchemas()', () => {
  it('should validate a simple schema by default', async () => {
    const simpleSchema = {};

    const visitedPaths = validateNestedSchemas(simpleSchema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths).toEqual(['']);
  });

  it('should not validate a simple schema if `includeSelf` is `false`', async () => {
    const schema = {};

    const visitedPaths = validateNestedSchemas(
      schema,
      [],
      (s, p) => {
        return [p.join('.')];
      },
      false
    );

    expect(visitedPaths).toEqual([]);
  });

  it('should validate a nested schema even if `includeSelf` is `false`', async () => {
    const schema = {
      properties: {
        nested_property: {},
      },
    };

    const visitedPaths = validateNestedSchemas(
      schema,
      [],
      (s, p) => {
        return [p.join('.')];
      },
      false
    );

    expect(visitedPaths).toEqual(['properties.nested_property']);
  });

  it('should validate `property` schemas', async () => {
    const schema = {
      properties: {
        one: {},
        two: {},
        three: {},
      },
    };

    const visitedPaths = validateNestedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(
      ['', 'properties.one', 'properties.two', 'properties.three'].sort()
    );
  });

  it('should validate `additionalProperties` schema', async () => {
    const schema = {
      additionalProperties: {},
    };

    const visitedPaths = validateNestedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(['', 'additionalProperties'].sort());
  });

  it('should validate `items` schema', async () => {
    const schema = {
      items: {},
    };

    const visitedPaths = validateNestedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(['', 'items'].sort());
  });

  it('should validate through `allOf` schema', async () => {
    const schema = {
      allOf: [{ properties: { inside_all_of: {} } }],
    };

    const visitedPaths = validateNestedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(
      ['', 'allOf.0.properties.inside_all_of'].sort()
    );
  });

  it('should validate through `oneOf` schema', async () => {
    const schema = {
      oneOf: [{ properties: { inside_one_of: {} } }],
    };

    const visitedPaths = validateNestedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(
      ['', 'oneOf.0.properties.inside_one_of'].sort()
    );
  });

  it('should validate through `anyOf` schema', async () => {
    const schema = {
      anyOf: [{ properties: { inside_any_of: {} } }],
    };

    const visitedPaths = validateNestedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(
      ['', 'anyOf.0.properties.inside_any_of'].sort()
    );
  });

  it('should not validate through `not` schema by default', async () => {
    const schema = {
      not: { properties: { inside_not: {} } },
    };

    const visitedPaths = validateNestedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths).toEqual(['']);
  });

  it('should validate through `not` schema if `includeNot` is true', async () => {
    const schema = {
      not: { properties: { inside_not: {} } },
    };

    const visitedPaths = validateNestedSchemas(
      schema,
      [],
      (s, p) => {
        return [p.join('.')];
      },
      true,
      true
    );

    expect(visitedPaths).toEqual(['', 'not.properties.inside_not']);
  });

  it('should recurse through `allOf`, `oneOf`, and `anyOf`', async () => {
    const schema = {
      allOf: [
        { oneOf: [{ anyOf: [{ properties: { can_you_find_me: {} } }] }] },
      ],
    };

    const visitedPaths = validateNestedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(
      ['', 'allOf.0.oneOf.0.anyOf.0.properties.can_you_find_me'].sort()
    );
  });

  it('recorded paths are accurate for each schema', async () => {
    const schema = {
      allOf: [{ properties: { inside_all_of: {} } }],
      properties: {
        nested_property: {},
      },
      additionalProperties: {
        oneOf: [
          {
            items: {},
          },
        ],
      },
    };

    function getObjectByPath(object, path) {
      while (path.length) {
        object = object[path.shift()];
      }

      return object;
    }

    validateNestedSchemas(schema, [], (s, p) => {
      expect(s).toBe(getObjectByPath(schema, [...p]));

      return [];
    });
  });

  it('should skip schemas defined by a $ref', async () => {
    const schema = {
      properties: {
        one: {},
        two: {},
        three: {
          $ref: '#/components/schemas/Three',
        },
      },
    };

    const visitedPaths = validateNestedSchemas(schema, [], (s, p) => {
      return [p.join('.')];
    });

    expect(visitedPaths.sort()).toEqual(
      ['', 'properties.one', 'properties.two'].sort()
    );
  });
});
