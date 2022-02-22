const { checkCompositeSchemaForProperty } = require('../src/utils');

describe('Utility function: checkCompositeSchemaForProperty()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(checkCompositeSchemaForProperty(undefined, 'my_property')).toBe(
      false
    );
  });

  it('should return `false` for `null`', async () => {
    expect(checkCompositeSchemaForProperty(null, 'my_property')).toBe(false);
  });

  it('should return `false` for empty schema', async () => {
    expect(checkCompositeSchemaForProperty({}, 'my_property')).toBe(false);
  });

  it('should return `true` for a compliant simple schema', async () => {
    const compliantSimpleSchema = { properties: { my_property: {} } };
    expect(
      checkCompositeSchemaForProperty(compliantSimpleSchema, 'my_property')
    ).toBe(true);
  });

  it('should return `false` for a schema with empty `oneOf`', async () => {
    const schemaWithEmptyOneOf = { oneOf: [] };
    expect(
      checkCompositeSchemaForProperty(schemaWithEmptyOneOf, 'my_property')
    ).toBe(false);
  });

  it('should return `false` for a schema with empty `anyOf`', async () => {
    const schemaWithEmptyOneOf = { anyOf: [] };
    expect(
      checkCompositeSchemaForProperty(schemaWithEmptyOneOf, 'my_property')
    ).toBe(false);
  });

  it('should return `false` for a schema with empty `allOf`', async () => {
    const schemaWithEmptyOneOf = { allOf: [] };
    expect(
      checkCompositeSchemaForProperty(schemaWithEmptyOneOf, 'my_property')
    ).toBe(false);
  });

  it('should return `true` for a schema with all-compliant `oneOf` schemas', async () => {
    const schemaWithAllCompliantOneOfs = {
      oneOf: [
        { properties: { my_property: {} } },
        { properties: { my_property: {} } },
        { properties: { my_property: {} } }
      ]
    };
    expect(
      checkCompositeSchemaForProperty(
        schemaWithAllCompliantOneOfs,
        'my_property'
      )
    ).toBe(true);
  });

  it('should return `true` for a schema with all-compliant `anyOf` schemas', async () => {
    const schemaWithAllCompliantAnyOfs = {
      anyOf: [
        { properties: { my_property: {} } },
        { properties: { my_property: {} } },
        { properties: { my_property: {} } }
      ]
    };
    expect(
      checkCompositeSchemaForProperty(
        schemaWithAllCompliantAnyOfs,
        'my_property'
      )
    ).toBe(true);
  });

  it('should return `true` for a schema with one of many compliant `allOf` schemas', async () => {
    const schemaWithOneCompliantAllOf = {
      allOf: [{}, { properties: { my_property: {} } }, {}]
    };
    expect(
      checkCompositeSchemaForProperty(
        schemaWithOneCompliantAllOf,
        'my_property'
      )
    ).toBe(true);
  });

  it('should return `false` for a schema with one of many compliant `oneOf` schemas', async () => {
    const schemaWithOneCompliantOneOf = {
      anyOf: [{}, { properties: { my_property: {} } }, {}]
    };
    expect(
      checkCompositeSchemaForProperty(
        schemaWithOneCompliantOneOf,
        'my_property'
      )
    ).toBe(false);
  });

  it('should return `false` for a schema with one of many compliant `anyOf` schemas', async () => {
    const schemaWithOneCompliantAnyOf = {
      anyOf: [{}, { properties: { my_property: {} } }, {}]
    };
    expect(
      checkCompositeSchemaForProperty(
        schemaWithOneCompliantAnyOf,
        'my_property'
      )
    ).toBe(false);
  });

  it('should return `true` for `oneOf` compliance even without `anyOf` or `allOf` compliance', async () => {
    const schemaWithOnlyOneOfCompliance = {
      oneOf: [
        { properties: { my_property: {} } },
        { properties: { my_property: {} } }
      ],
      anyOf: [{ properties: { my_property: {} } }, {}],
      allOf: [{}, {}]
    };
    expect(
      checkCompositeSchemaForProperty(
        schemaWithOnlyOneOfCompliance,
        'my_property'
      )
    ).toBe(true);
  });

  it('should return `true` for `anyOf` compliance even without `oneOf` or `allOf` compliance', async () => {
    const schemaWithOnlyAnyOfCompliance = {
      anyOf: [
        { properties: { my_property: {} } },
        { properties: { my_property: {} } }
      ],
      oneOf: [{ properties: { my_property: {} } }, {}],
      allOf: [{}, {}]
    };
    expect(
      checkCompositeSchemaForProperty(
        schemaWithOnlyAnyOfCompliance,
        'my_property'
      )
    ).toBe(true);
  });

  it('should return `true` for `allOf` compliance even without `oneOf` or `anyOf` compliance', async () => {
    const schemaWithOnlyAllOfCompliance = {
      allOf: [{}, { properties: { my_property: {} } }, {}],
      oneOf: [{}, { properties: { my_property: {} } }],
      anyOf: [{ properties: { my_property: {} } }, {}]
    };
    expect(
      checkCompositeSchemaForProperty(
        schemaWithOnlyAllOfCompliance,
        'my_property'
      )
    ).toBe(true);
  });

  it('should recurse through `oneOf` and `allOf`', async () => {
    const schemaWithAllOfInOneOf = {
      oneOf: [
        {
          allOf: [{ properties: { my_property: {} } }, {}]
        },
        { properties: { my_property: {} } }
      ]
    };
    expect(
      checkCompositeSchemaForProperty(schemaWithAllOfInOneOf, 'my_property')
    ).toBe(true);
  });

  it('should recurse through `allOf` and `anyOf`', async () => {
    const schemaWithAnyOfInAllOf = {
      allOf: [
        {
          anyOf: [
            { properties: { my_property: {} } },
            { properties: { my_property: {} } }
          ]
        },
        {}
      ]
    };
    expect(
      checkCompositeSchemaForProperty(schemaWithAnyOfInAllOf, 'my_property')
    ).toBe(true);
  });

  it('should recurse through `anyOf` and `oneOf`', async () => {
    const schemaWithAnyOfInAllOf = {
      anyOf: [
        {
          oneOf: [
            { properties: { my_property: {} } },
            { properties: { my_property: {} } }
          ]
        },
        { properties: { my_property: {} } }
      ]
    };
    expect(
      checkCompositeSchemaForProperty(schemaWithAnyOfInAllOf, 'my_property')
    ).toBe(true);
  });
});
