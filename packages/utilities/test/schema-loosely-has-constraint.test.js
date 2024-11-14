/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { schemaLooselyHasConstraint } = require('../src');

const fredIsNull = s => s.fred === null;

describe('Utility function: schemaLooselyHasConstraint()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(schemaLooselyHasConstraint(undefined, fredIsNull)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(schemaLooselyHasConstraint(null, fredIsNull)).toBe(false);
  });

  it('should return `false` for empty schema', async () => {
    expect(schemaLooselyHasConstraint({}, fredIsNull)).toBe(false);
  });

  it('should return `true` for a compliant simple schema', async () => {
    const compliantSimpleSchema = { fred: null };
    expect(schemaLooselyHasConstraint(compliantSimpleSchema, fredIsNull)).toBe(
      true
    );
  });

  it('should return `false` for a schema with empty `oneOf`', async () => {
    const schemaWithEmptyOneOf = { oneOf: [] };
    expect(schemaLooselyHasConstraint(schemaWithEmptyOneOf, fredIsNull)).toBe(
      false
    );
  });

  it('should return `false` for a schema with empty `anyOf`', async () => {
    const schemaWithEmptyOneOf = { anyOf: [] };
    expect(schemaLooselyHasConstraint(schemaWithEmptyOneOf, fredIsNull)).toBe(
      false
    );
  });

  it('should return `false` for a schema with empty `allOf`', async () => {
    const schemaWithEmptyOneOf = { allOf: [] };
    expect(schemaLooselyHasConstraint(schemaWithEmptyOneOf, fredIsNull)).toBe(
      false
    );
  });

  it('should return `true` for a schema with all-compliant `oneOf` schemas', async () => {
    const schemaWithAllCompliantOneOfs = {
      oneOf: [{ fred: null }, { fred: null }, { fred: null }],
    };
    expect(
      schemaLooselyHasConstraint(schemaWithAllCompliantOneOfs, fredIsNull)
    ).toBe(true);
  });

  it('should return `true` for a schema with all-compliant `anyOf` schemas', async () => {
    const schemaWithAllCompliantAnyOfs = {
      anyOf: [{ fred: null }, { fred: null }, { fred: null }],
    };
    expect(
      schemaLooselyHasConstraint(schemaWithAllCompliantAnyOfs, fredIsNull)
    ).toBe(true);
  });

  it('should return `true` for a schema with one of many compliant `allOf` schemas', async () => {
    const schemaWithOneCompliantAllOf = {
      allOf: [{}, { fred: null }, {}],
    };
    expect(
      schemaLooselyHasConstraint(schemaWithOneCompliantAllOf, fredIsNull)
    ).toBe(true);
  });

  it('should return `true` for a schema with one of many compliant `oneOf` schemas', async () => {
    const schemaWithOneCompliantOneOf = {
      anyOf: [{}, { fred: null }, {}],
    };
    expect(
      schemaLooselyHasConstraint(schemaWithOneCompliantOneOf, fredIsNull)
    ).toBe(true);
  });

  it('should return `true` for a schema with one of many compliant `anyOf` schemas', async () => {
    const schemaWithOneCompliantAnyOf = {
      anyOf: [{}, { fred: null }, {}],
    };
    expect(
      schemaLooselyHasConstraint(schemaWithOneCompliantAnyOf, fredIsNull)
    ).toBe(true);
  });

  it('should return `true` for `oneOf` compliance even without `anyOf` or `allOf` compliance', async () => {
    const schemaWithOnlyOneOfCompliance = {
      oneOf: [{ fred: null }, { fred: null }],
      anyOf: [{ fred: null }, {}],
      allOf: [{}, {}],
    };
    expect(
      schemaLooselyHasConstraint(schemaWithOnlyOneOfCompliance, fredIsNull)
    ).toBe(true);
  });

  it('should return `true` for `anyOf` compliance even without `oneOf` or `allOf` compliance', async () => {
    const schemaWithOnlyAnyOfCompliance = {
      anyOf: [{ fred: null }, { fred: null }],
      oneOf: [{ fred: null }, {}],
      allOf: [{}, {}],
    };
    expect(
      schemaLooselyHasConstraint(schemaWithOnlyAnyOfCompliance, fredIsNull)
    ).toBe(true);
  });

  it('should return `true` for `allOf` compliance even without `oneOf` or `anyOf` compliance', async () => {
    const schemaWithOnlyAllOfCompliance = {
      allOf: [{}, { fred: null }, {}],
      oneOf: [{}, { fred: null }],
      anyOf: [{ fred: null }, {}],
    };
    expect(
      schemaLooselyHasConstraint(schemaWithOnlyAllOfCompliance, fredIsNull)
    ).toBe(true);
  });

  it('should recurse through `oneOf` and `allOf`', async () => {
    const schemaWithAllOfInOneOf = {
      oneOf: [
        {
          allOf: [{ fred: null }, {}],
        },
        { fred: null },
      ],
    };
    expect(schemaLooselyHasConstraint(schemaWithAllOfInOneOf, fredIsNull)).toBe(
      true
    );
  });

  it('should recurse through `allOf` and `anyOf`', async () => {
    const schemaWithAnyOfInAllOf = {
      allOf: [
        {
          anyOf: [{ fred: null }, { fred: null }],
        },
        {},
      ],
    };
    expect(schemaLooselyHasConstraint(schemaWithAnyOfInAllOf, fredIsNull)).toBe(
      true
    );
  });

  it('should recurse through `anyOf` and `oneOf`', async () => {
    const schemaWithAnyOfInAllOf = {
      anyOf: [
        {
          oneOf: [{ fred: null }, { fred: null }],
        },
        { fred: null },
      ],
    };
    expect(schemaLooselyHasConstraint(schemaWithAnyOfInAllOf, fredIsNull)).toBe(
      true
    );
  });
});
