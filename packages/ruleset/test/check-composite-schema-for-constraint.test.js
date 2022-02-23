const { checkCompositeSchemaForConstraint } = require('../src/utils');

const fredIsNull = s => s.fred === null;

describe('Utility function: checkCompositeSchemaForConstraint()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(checkCompositeSchemaForConstraint(undefined, fredIsNull)).toBe(
      false
    );
  });

  it('should return `false` for `null`', async () => {
    expect(checkCompositeSchemaForConstraint(null, fredIsNull)).toBe(false);
  });

  it('should return `false` for empty schema', async () => {
    expect(checkCompositeSchemaForConstraint({}, fredIsNull)).toBe(false);
  });

  it('should return `true` for a compliant simple schema', async () => {
    const compliantSimpleSchema = { fred: null };
    expect(
      checkCompositeSchemaForConstraint(compliantSimpleSchema, fredIsNull)
    ).toBe(true);
  });

  it('should return `false` for a schema with empty `oneOf`', async () => {
    const schemaWithEmptyOneOf = { oneOf: [] };
    expect(
      checkCompositeSchemaForConstraint(schemaWithEmptyOneOf, fredIsNull)
    ).toBe(false);
  });

  it('should return `false` for a schema with empty `anyOf`', async () => {
    const schemaWithEmptyOneOf = { anyOf: [] };
    expect(
      checkCompositeSchemaForConstraint(schemaWithEmptyOneOf, fredIsNull)
    ).toBe(false);
  });

  it('should return `false` for a schema with empty `allOf`', async () => {
    const schemaWithEmptyOneOf = { allOf: [] };
    expect(
      checkCompositeSchemaForConstraint(schemaWithEmptyOneOf, fredIsNull)
    ).toBe(false);
  });

  it('should return `true` for a schema with all-compliant `oneOf` schemas', async () => {
    const schemaWithAllCompliantOneOfs = {
      oneOf: [{ fred: null }, { fred: null }, { fred: null }]
    };
    expect(
      checkCompositeSchemaForConstraint(
        schemaWithAllCompliantOneOfs,
        fredIsNull
      )
    ).toBe(true);
  });

  it('should return `true` for a schema with all-compliant `anyOf` schemas', async () => {
    const schemaWithAllCompliantAnyOfs = {
      anyOf: [{ fred: null }, { fred: null }, { fred: null }]
    };
    expect(
      checkCompositeSchemaForConstraint(
        schemaWithAllCompliantAnyOfs,
        fredIsNull
      )
    ).toBe(true);
  });

  it('should return `true` for a schema with one of many compliant `allOf` schemas', async () => {
    const schemaWithOneCompliantAllOf = {
      allOf: [{}, { fred: null }, {}]
    };
    expect(
      checkCompositeSchemaForConstraint(schemaWithOneCompliantAllOf, fredIsNull)
    ).toBe(true);
  });

  it('should return `false` for a schema with one of many compliant `oneOf` schemas', async () => {
    const schemaWithOneCompliantOneOf = {
      anyOf: [{}, { fred: null }, {}]
    };
    expect(
      checkCompositeSchemaForConstraint(schemaWithOneCompliantOneOf, fredIsNull)
    ).toBe(false);
  });

  it('should return `false` for a schema with one of many compliant `anyOf` schemas', async () => {
    const schemaWithOneCompliantAnyOf = {
      anyOf: [{}, { fred: null }, {}]
    };
    expect(
      checkCompositeSchemaForConstraint(schemaWithOneCompliantAnyOf, fredIsNull)
    ).toBe(false);
  });

  it('should return `true` for `oneOf` compliance even without `anyOf` or `allOf` compliance', async () => {
    const schemaWithOnlyOneOfCompliance = {
      oneOf: [{ fred: null }, { fred: null }],
      anyOf: [{ fred: null }, {}],
      allOf: [{}, {}]
    };
    expect(
      checkCompositeSchemaForConstraint(
        schemaWithOnlyOneOfCompliance,
        fredIsNull
      )
    ).toBe(true);
  });

  it('should return `true` for `anyOf` compliance even without `oneOf` or `allOf` compliance', async () => {
    const schemaWithOnlyAnyOfCompliance = {
      anyOf: [{ fred: null }, { fred: null }],
      oneOf: [{ fred: null }, {}],
      allOf: [{}, {}]
    };
    expect(
      checkCompositeSchemaForConstraint(
        schemaWithOnlyAnyOfCompliance,
        fredIsNull
      )
    ).toBe(true);
  });

  it('should return `true` for `allOf` compliance even without `oneOf` or `anyOf` compliance', async () => {
    const schemaWithOnlyAllOfCompliance = {
      allOf: [{}, { fred: null }, {}],
      oneOf: [{}, { fred: null }],
      anyOf: [{ fred: null }, {}]
    };
    expect(
      checkCompositeSchemaForConstraint(
        schemaWithOnlyAllOfCompliance,
        fredIsNull
      )
    ).toBe(true);
  });

  it('should recurse through `oneOf` and `allOf`', async () => {
    const schemaWithAllOfInOneOf = {
      oneOf: [
        {
          allOf: [{ fred: null }, {}]
        },
        { fred: null }
      ]
    };
    expect(
      checkCompositeSchemaForConstraint(schemaWithAllOfInOneOf, fredIsNull)
    ).toBe(true);
  });

  it('should recurse through `allOf` and `anyOf`', async () => {
    const schemaWithAnyOfInAllOf = {
      allOf: [
        {
          anyOf: [{ fred: null }, { fred: null }]
        },
        {}
      ]
    };
    expect(
      checkCompositeSchemaForConstraint(schemaWithAnyOfInAllOf, fredIsNull)
    ).toBe(true);
  });

  it('should recurse through `anyOf` and `oneOf`', async () => {
    const schemaWithAnyOfInAllOf = {
      anyOf: [
        {
          oneOf: [{ fred: null }, { fred: null }]
        },
        { fred: null }
      ]
    };
    expect(
      checkCompositeSchemaForConstraint(schemaWithAnyOfInAllOf, fredIsNull)
    ).toBe(true);
  });
});
