/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { collectFromComposedSchemas } = require('../src');

describe('Utility function: collectFromComposedSchemas()', () => {
  it('should return `[]` for `undefined` or `null`', async () => {
    expect(collectFromComposedSchemas(undefined, () => ['foo'])).toEqual([]);
    expect(collectFromComposedSchemas(null, () => ['foo'])).toEqual([]);
  });

  it('should not run collector for `undefined` or `null`', async () => {
    expect(() =>
      collectFromComposedSchemas(undefined, () => {
        throw new Error();
      })
    ).not.toThrow();
    expect(() =>
      collectFromComposedSchemas(null, () => {
        throw new Error();
      })
    ).not.toThrow();
  });

  it('should collect once from a simple schema', async () => {
    const schemaFoo = { foo: Math.random() };
    const collectedFrom = [];

    collectFromComposedSchemas(schemaFoo, s => {
      collectedFrom.push(s);

      return [];
    });

    expect(collectedFrom.length).toEqual(1);
    expect(collectedFrom[0]).toEqual(schemaFoo);
  });

  it('should collect from a composed schema', async () => {
    const composedSchema = {
      foo: Math.random(),
      allOf: [
        {
          foo: Math.random(),
        },
      ],
      oneOf: [
        {
          foo: Math.random(),
        },
      ],
      anyOf: [
        {
          foo: Math.random(),
        },
      ],
    };

    expect(
      collectFromComposedSchemas(composedSchema, s => [s.foo]).sort()
    ).toEqual(
      [
        composedSchema.foo,
        composedSchema.allOf[0].foo,
        composedSchema.oneOf[0].foo,
        composedSchema.anyOf[0].foo,
      ].sort()
    );
  });

  it('should collect from a deeply composed schema', async () => {
    const deeplyComposedSchema = {
      foo: Math.random(),
      allOf: [
        {
          foo: Math.random(),
          oneOf: [
            {
              foo: Math.random(),
              anyOf: [
                {
                  foo: Math.random(),
                },
              ],
            },
          ],
        },
      ],
    };

    expect(
      collectFromComposedSchemas(deeplyComposedSchema, s => [s.foo]).sort()
    ).toEqual(
      [
        deeplyComposedSchema.foo,
        deeplyComposedSchema.allOf[0].foo,
        deeplyComposedSchema.allOf[0].oneOf[0].foo,
        deeplyComposedSchema.allOf[0].oneOf[0].anyOf[0].foo,
      ].sort()
    );
  });

  it('should de-duplicate primitive items collected in a composed schema', async () => {
    const value = Math.random();

    expect(
      collectFromComposedSchemas(
        {
          foo: value,
          allOf: [
            {
              foo: value + 0,
            },
          ],
        },
        s => [s.foo]
      )
    ).toEqual([value]);
  });

  it('should not deduplicate non-primitive examples for composed schema', async () => {
    expect(
      collectFromComposedSchemas(
        {
          foo: {},
          allOf: [
            {
              foo: {},
            },
          ],
        },
        s => [s.foo]
      )
    ).toEqual([{}, {}]);
  });

  it('should not collect from self if includeSelf = false', async () => {
    const composedSchema = {
      foo: Math.random(),
      allOf: [
        {
          foo: Math.random(),
        },
      ],
    };

    expect(
      collectFromComposedSchemas(composedSchema, s => [s.foo], false).sort()
    ).toEqual([composedSchema.allOf[0].foo].sort());
  });

  it('should not collect from `not` if includeNot = false', async () => {
    const composedSchema = {
      foo: Math.random(),
      not: {
        foo: Math.random(),
      },
    };

    expect(
      collectFromComposedSchemas(
        composedSchema,
        s => [s.foo],
        true,
        false
      ).sort()
    ).toEqual([composedSchema.foo].sort());
  });

  it('should collect from `not` if includeNot = true', async () => {
    const composedSchema = {
      foo: Math.random(),
      not: {
        foo: Math.random(),
      },
    };

    expect(
      collectFromComposedSchemas(
        composedSchema,
        s => [s.foo],
        true,
        true
      ).sort()
    ).toEqual([composedSchema.foo, composedSchema.not.foo].sort());
  });
});
