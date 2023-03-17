/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { schemaRequiresProperty } = require('../src');

describe('Utility function: schemaRequiresProperty()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(schemaRequiresProperty(undefined, 'fungibility')).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(schemaRequiresProperty(null, 'fungibility')).toBe(false);
  });

  it('should return `false` for empty schema', async () => {
    expect(schemaRequiresProperty({}, 'fungibility')).toBe(false);
  });

  it('should return `true` for a compliant simple schema', async () => {
    const compliantSimpleSchema = {
      required: ['fungibility'],
      properties: { fungibility: {} },
    };
    expect(schemaRequiresProperty(compliantSimpleSchema, 'fungibility')).toBe(
      true
    );
  });

  it('should return `false` for a schema with empty `oneOf`', async () => {
    const schemaWithEmptyOneOf = { oneOf: [] };
    expect(schemaRequiresProperty(schemaWithEmptyOneOf, 'fungibility')).toBe(
      false
    );
  });

  it('should return `false` for a schema with empty `anyOf`', async () => {
    const schemaWithEmptyOneOf = { anyOf: [] };
    expect(schemaRequiresProperty(schemaWithEmptyOneOf, 'fungibility')).toBe(
      false
    );
  });

  it('should return `false` for a schema with empty `allOf`', async () => {
    const schemaWithEmptyOneOf = { allOf: [] };
    expect(schemaRequiresProperty(schemaWithEmptyOneOf, 'fungibility')).toBe(
      false
    );
  });

  it('should return `true` for a schema with all-compliant `oneOf` schemas', async () => {
    const schemaWithAllCompliantOneOfs = {
      oneOf: [
        { required: ['fungibility'], properties: { fungibility: {} } },
        { required: ['fungibility'], properties: { fungibility: {} } },
        { required: ['fungibility'], properties: { fungibility: {} } },
      ],
    };
    expect(
      schemaRequiresProperty(schemaWithAllCompliantOneOfs, 'fungibility')
    ).toBe(true);
  });

  it('should return `true` for a schema with all-compliant `anyOf` schemas', async () => {
    const schemaWithAllCompliantAnyOfs = {
      anyOf: [
        { required: ['fungibility'], properties: { fungibility: {} } },
        { required: ['fungibility'], properties: { fungibility: {} } },
        { required: ['fungibility'], properties: { fungibility: {} } },
      ],
    };
    expect(
      schemaRequiresProperty(schemaWithAllCompliantAnyOfs, 'fungibility')
    ).toBe(true);
  });

  it('should return `true` for a schema with one of many compliant `allOf` schemas', async () => {
    const schemaWithOneCompliantAllOf = {
      allOf: [
        {},
        { required: ['fungibility'], properties: { fungibility: {} } },
        {},
      ],
    };
    expect(
      schemaRequiresProperty(schemaWithOneCompliantAllOf, 'fungibility')
    ).toBe(true);
  });

  it('should return `false` for a schema with one of many compliant `oneOf` schemas', async () => {
    const schemaWithOneCompliantOneOf = {
      anyOf: [
        {},
        { required: ['fungibility'], properties: { fungibility: {} } },
        {},
      ],
    };
    expect(
      schemaRequiresProperty(schemaWithOneCompliantOneOf, 'fungibility')
    ).toBe(false);
  });

  it('should return `false` for a schema with one of many compliant `anyOf` schemas', async () => {
    const schemaWithOneCompliantAnyOf = {
      anyOf: [{}, { required: ['fungibility'] }, {}],
    };
    expect(
      schemaRequiresProperty(schemaWithOneCompliantAnyOf, 'fungibility')
    ).toBe(false);
  });

  it('should return `true` for `oneOf` compliance even without `anyOf` or `allOf` compliance', async () => {
    const schemaWithOnlyOneOfCompliance = {
      oneOf: [
        { required: ['fungibility'], properties: { fungibility: {} } },
        { required: ['fungibility'], properties: { fungibility: {} } },
      ],
      anyOf: [
        { required: ['fungibility'], properties: { fungibility: {} } },
        {},
      ],
      allOf: [{}, {}],
    };
    expect(
      schemaRequiresProperty(schemaWithOnlyOneOfCompliance, 'fungibility')
    ).toBe(true);
  });

  it('should return `true` for `anyOf` compliance even without `oneOf` or `allOf` compliance', async () => {
    const schemaWithOnlyAnyOfCompliance = {
      anyOf: [
        { required: ['fungibility'], properties: { fungibility: {} } },
        { required: ['fungibility'], properties: { fungibility: {} } },
      ],
      oneOf: [
        { required: ['fungibility'], properties: { fungibility: {} } },
        {},
      ],
      allOf: [{}, {}],
    };
    expect(
      schemaRequiresProperty(schemaWithOnlyAnyOfCompliance, 'fungibility')
    ).toBe(true);
  });

  it('should return `true` for `allOf` compliance even without `oneOf` or `anyOf` compliance', async () => {
    const schemaWithOnlyAllOfCompliance = {
      allOf: [
        {},
        { required: ['fungibility'], properties: { fungibility: {} } },
        {},
      ],
      oneOf: [
        {},
        { required: ['fungibility'], properties: { fungibility: {} } },
      ],
      anyOf: [
        { required: ['fungibility'], properties: { fungibility: {} } },
        {},
      ],
    };
    expect(
      schemaRequiresProperty(schemaWithOnlyAllOfCompliance, 'fungibility')
    ).toBe(true);
  });

  it('should recurse through `oneOf` and `allOf`', async () => {
    const schemaWithAllOfInOneOf = {
      oneOf: [
        {
          allOf: [
            { required: ['fungibility'], properties: { fungibility: {} } },
            {},
          ],
        },
        { required: ['fungibility'], properties: { fungibility: {} } },
      ],
    };
    expect(schemaRequiresProperty(schemaWithAllOfInOneOf, 'fungibility')).toBe(
      true
    );
  });

  it('should recurse through `allOf` and `anyOf`', async () => {
    const schemaWithAnyOfInAllOf = {
      allOf: [
        {
          anyOf: [
            { required: ['fungibility'], properties: { fungibility: {} } },
            { required: ['fungibility'], properties: { fungibility: {} } },
          ],
        },
        {},
      ],
    };
    expect(schemaRequiresProperty(schemaWithAnyOfInAllOf, 'fungibility')).toBe(
      true
    );
  });

  it('should recurse through `anyOf` and `oneOf`', async () => {
    const schemaWithAnyOfInAllOf = {
      anyOf: [
        {
          oneOf: [
            { required: ['fungibility'], properties: { fungibility: {} } },
            { required: ['fungibility'], properties: { fungibility: {} } },
          ],
        },
        { required: ['fungibility'], properties: { fungibility: {} } },
      ],
    };
    expect(schemaRequiresProperty(schemaWithAnyOfInAllOf, 'fungibility')).toBe(
      true
    );
  });
});
