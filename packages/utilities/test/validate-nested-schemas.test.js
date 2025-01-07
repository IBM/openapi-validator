/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { validateNestedSchemas } = require('../src');

describe('Utility function: validateNestedSchemas()', () => {
  it('should validate a simple schema by default', async () => {
    const schema = {};

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(schema, [], (s, p, lp) => {
      visitedPaths.push(p.join('.'));
      visitedLogicalPaths.push(lp.join('.'));
      return [index++];
    });

    expect(visitedPaths).toEqual(['']);
    expect(visitedLogicalPaths).toEqual(['']);
    expect(results).toEqual([1]);
  });

  it('should not validate a simple schema if `includeSelf` is `false`', async () => {
    const schema = {};

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(
      schema,
      [],
      (s, p, lp) => {
        visitedPaths.push(p.join('.'));
        visitedLogicalPaths.push(lp.join('.'));
        return [index++];
      },
      false
    );

    expect(visitedPaths).toEqual([]);
    expect(visitedLogicalPaths).toEqual([]);
    expect(results).toEqual([]);
  });

  it('should validate a nested schema even if `includeSelf` is `false`', async () => {
    const schema = {
      properties: {
        nested_property: {},
      },
    };

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(
      schema,
      [],
      (s, p, lp) => {
        visitedPaths.push(p.join('.'));
        visitedLogicalPaths.push(lp.join('.'));
        return [index++];
      },
      false
    );

    expect(visitedPaths).toEqual(['properties.nested_property']);
    expect(visitedLogicalPaths).toEqual(['nested_property']);
    expect(results).toEqual([1]);
  });

  it('should validate `property` schemas', async () => {
    const schema = {
      properties: {
        one: {},
        two: {},
        three: {},
      },
    };

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(schema, [], (s, p, lp) => {
      visitedPaths.push(p.join('.'));
      visitedLogicalPaths.push(lp.join('.'));
      return [index++];
    });

    expect(visitedPaths.sort()).toEqual(
      ['', 'properties.one', 'properties.two', 'properties.three'].sort()
    );
    expect(visitedLogicalPaths.sort()).toEqual(
      ['', 'one', 'two', 'three'].sort()
    );
    expect(results.sort()).toEqual([1, 2, 3, 4]);
  });

  it('should validate `additionalProperties` schema', async () => {
    const schema = {
      additionalProperties: {},
    };

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(schema, [], (s, p, lp) => {
      visitedPaths.push(p.join('.'));
      visitedLogicalPaths.push(lp.join('.'));
      return [index++];
    });

    expect(visitedPaths.sort()).toEqual(['', 'additionalProperties']);
    expect(visitedLogicalPaths.sort()).toEqual(['', '*']);
    expect(results.sort()).toEqual([1, 2]);
  });

  it('should validate `items` schema', async () => {
    const schema = {
      items: {},
    };

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(schema, [], (s, p, lp) => {
      visitedPaths.push(p.join('.'));
      visitedLogicalPaths.push(lp.join('.'));
      return [index++];
    });

    expect(visitedPaths.sort()).toEqual(['', 'items']);
    expect(visitedLogicalPaths.sort()).toEqual(['', '[]']);
    expect(results.sort()).toEqual([1, 2]);
  });

  it('should validate deeply nested schemas', async () => {
    const schema = {
      properties: {
        one: {
          properties: {
            two: {
              additionalProperties: {
                patternProperties: {
                  '^foo$': {
                    items: {},
                  },
                },
              },
            },
          },
        },
      },
    };

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(schema, [], (s, p, lp) => {
      visitedPaths.push(p.join('.'));
      visitedLogicalPaths.push(lp.join('.'));
      return [index++];
    });

    expect(visitedPaths.sort()).toEqual([
      '',
      'properties.one',
      'properties.one.properties.two',
      'properties.one.properties.two.additionalProperties',
      'properties.one.properties.two.additionalProperties.patternProperties.^foo$',
      'properties.one.properties.two.additionalProperties.patternProperties.^foo$.items',
    ]);
    expect(visitedLogicalPaths.sort()).toEqual([
      '',
      'one',
      'one.two',
      'one.two.*',
      'one.two.*.*',
      'one.two.*.*.[]',
    ]);
    expect(results.sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should validate a schema before validating its nested schemas', async () => {
    const schema = {
      properties: {
        one: {
          properties: {
            two: {
              additionalProperties: {
                patternProperties: {
                  '^foo$': {
                    items: {},
                  },
                },
              },
            },
          },
        },
      },
    };

    const visitedPaths = [];
    let index = 1;

    const results = validateNestedSchemas(schema, [], (s, p) => {
      visitedPaths.push(p.join('.'));
      return [index++];
    });

    expect(visitedPaths).toEqual([
      '',
      'properties.one',
      'properties.one.properties.two',
      'properties.one.properties.two.additionalProperties',
      'properties.one.properties.two.additionalProperties.patternProperties.^foo$',
      'properties.one.properties.two.additionalProperties.patternProperties.^foo$.items',
    ]);
    expect(results.sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("should validate a schema's nesting parent more recently than its parent's siblings", async () => {
    const schema = {
      items: { additionalProperties: {} },
      additionalProperties: { patternProperties: { '^baz$': {} } },
      patternProperties: {
        '^foo$': { properties: { baz: {} } },
        '^bar$': { properties: { baz: {} } },
      },
      properties: {
        a: {},
        one: { items: {} },
        z: {},
      },
    };

    const visitedPaths = [];

    validateNestedSchemas(schema, [], (s, p) => {
      visitedPaths.push(p.join('.'));
      return [];
    });

    expect(visitedPaths.indexOf('items.additionalProperties') - 1).toEqual(
      visitedPaths.indexOf('items')
    );
    expect(
      visitedPaths.indexOf('additionalProperties.patternProperties.^baz$') - 1
    ).toEqual(visitedPaths.indexOf('additionalProperties'));
    expect(
      visitedPaths.indexOf('patternProperties.^foo$.properties.baz') - 1
    ).toEqual(visitedPaths.indexOf('patternProperties.^foo$'));
    expect(visitedPaths.indexOf('properties.one.items') - 1).toEqual(
      visitedPaths.indexOf('properties.one')
    );
  });

  it('should validate through `allOf` schema', async () => {
    const schema = {
      allOf: [{ properties: { inside_all_of: {} } }],
    };

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(schema, [], (s, p, lp) => {
      visitedPaths.push(p.join('.'));
      visitedLogicalPaths.push(lp.join('.'));
      return [index++];
    });

    expect(visitedPaths.sort()).toEqual([
      '',
      'allOf.0.properties.inside_all_of',
    ]);
    expect(visitedLogicalPaths.sort()).toEqual(['', 'inside_all_of']);
    expect(results.sort()).toEqual([1, 2]);
  });

  it('should validate through `oneOf` schema', async () => {
    const schema = {
      oneOf: [{ properties: { inside_one_of: {} } }],
    };

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(schema, [], (s, p, lp) => {
      visitedPaths.push(p.join('.'));
      visitedLogicalPaths.push(lp.join('.'));
      return [index++];
    });

    expect(visitedPaths.sort()).toEqual([
      '',
      'oneOf.0.properties.inside_one_of',
    ]);
    expect(visitedLogicalPaths.sort()).toEqual(['', 'inside_one_of']);
    expect(results.sort()).toEqual([1, 2]);
  });

  it('should validate through `anyOf` schema', async () => {
    const schema = {
      anyOf: [{ properties: { inside_any_of: {} } }],
    };

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(schema, [], (s, p, lp) => {
      visitedPaths.push(p.join('.'));
      visitedLogicalPaths.push(lp.join('.'));
      return [index++];
    });

    expect(visitedPaths.sort()).toEqual([
      '',
      'anyOf.0.properties.inside_any_of',
    ]);
    expect(visitedLogicalPaths.sort()).toEqual(['', 'inside_any_of']);
    expect(results.sort()).toEqual([1, 2]);
  });

  it('should not validate through `not` schema by default', async () => {
    const schema = {
      not: { properties: { inside_not: {} } },
    };

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(schema, [], (s, p, lp) => {
      visitedPaths.push(p.join('.'));
      visitedLogicalPaths.push(lp.join('.'));
      return [index++];
    });

    expect(visitedPaths).toEqual(['']);
    expect(visitedLogicalPaths).toEqual(['']);
    expect(results).toEqual([1]);
  });

  it('should validate through `not` schema if `includeNot` is true', async () => {
    const schema = {
      not: { properties: { inside_not: {} } },
    };

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(
      schema,
      [],
      (s, p, lp) => {
        visitedPaths.push(p.join('.'));
        visitedLogicalPaths.push(lp.join('.'));
        return [index++];
      },
      true,
      true
    );

    expect(visitedPaths.sort()).toEqual(['', 'not.properties.inside_not']);
    expect(visitedLogicalPaths.sort()).toEqual(['', 'inside_not']);
    expect(results.sort()).toEqual([1, 2]);
  });

  it('should recurse through `allOf`, `oneOf`, and `anyOf`', async () => {
    const schema = {
      allOf: [
        { oneOf: [{ anyOf: [{ properties: { can_you_find_me: {} } }] }] },
      ],
    };

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(
      schema,
      [],
      (s, p, lp) => {
        visitedPaths.push(p.join('.'));
        visitedLogicalPaths.push(lp.join('.'));
        return [index++];
      },
      true,
      true
    );

    expect(visitedPaths.sort()).toEqual([
      '',
      'allOf.0.oneOf.0.anyOf.0.properties.can_you_find_me',
    ]);
    expect(visitedLogicalPaths.sort()).toEqual(['', 'can_you_find_me']);
    expect(results.sort()).toEqual([1, 2]);
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

    const visitedPaths = [];
    const visitedLogicalPaths = [];
    let index = 1;

    const results = validateNestedSchemas(schema, [], (s, p, lp) => {
      visitedPaths.push(p.join('.'));
      visitedLogicalPaths.push(lp.join('.'));
      return [index++];
    });

    expect(visitedPaths.sort()).toEqual(
      ['', 'properties.one', 'properties.two'].sort()
    );
    expect(visitedLogicalPaths.sort()).toEqual(['', 'one', 'two'].sort());
    expect(results.sort()).toEqual([1, 2, 3]);
  });
});
