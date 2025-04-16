/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { allSchemasDocument, testRule } = require('./utils');
const { validateSubschemas } = require('../src');
const { schemas } = require('../src/collections');

describe('Utility: validateSubschemas', () => {
  const visitedPaths = [];
  const visitedLogicalPaths = [];

  function pathRecorder(schema, path, logicalPath) {
    visitedPaths.push(path.join('.'));
    visitedLogicalPaths.push(logicalPath.join('.'));
    return [];
  }

  function ruleFunction(schema, _opts, { path }) {
    return validateSubschemas(schema, path, pathRecorder);
  }

  // this needs to be executed as a spectral rule to resolve the document
  const ruleForTesting = {
    given: schemas,
    resolved: true,
    then: {
      function: ruleFunction,
    },
  };

  it('should find all subschemas', async () => {
    await testRule(ruleForTesting, allSchemasDocument);

    expect(visitedPaths.length).toBe(24);
    expect(visitedLogicalPaths.length).toBe(24);

    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_property_schema'
    );
    expect(visitedLogicalPaths).toContain('schema_with_property_schema');
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_property_schema.properties.property_schema'
    );
    expect(visitedLogicalPaths).toContain(
      'schema_with_property_schema.property_schema'
    );
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_additional_properties_schema'
    );
    expect(visitedLogicalPaths).toContain(
      'schema_with_additional_properties_schema'
    );
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_additional_properties_schema.additionalProperties'
    );
    expect(visitedLogicalPaths).toContain(
      'schema_with_additional_properties_schema.*'
    );
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_items_schema'
    );
    expect(visitedLogicalPaths).toContain('schema_with_items_schema');
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_items_schema.items'
    );
    expect(visitedLogicalPaths).toContain('schema_with_items_schema.[]');
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_all_of_schema'
    );
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_all_of_schema.allOf.0'
    );
    expect(
      visitedLogicalPaths.filter(p => p === 'schema_with_all_of_schema').length
    ).toEqual(2);
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_one_of_schema'
    );
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_one_of_schema.oneOf.0'
    );
    expect(
      visitedLogicalPaths.filter(p => p === 'schema_with_one_of_schema').length
    ).toEqual(2);
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_any_of_schema'
    );
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_any_of_schema.anyOf.0'
    );
    expect(
      visitedLogicalPaths.filter(p => p === 'schema_with_any_of_schema').length
    ).toEqual(2);
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_not_schema'
    );
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_not_schema.not'
    );
    expect(visitedPaths).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.properties.property_schema'
    );
    expect(visitedLogicalPaths).toContain('property_schema');
    expect(visitedPaths).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.properties.property_schema.properties.property_schema'
    );
    expect(visitedLogicalPaths).toContain('property_schema.property_schema');
    expect(visitedPaths).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.items'
    );
    expect(visitedLogicalPaths).toContain('[]');
    expect(visitedPaths).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.additionalProperties'
    );
    expect(visitedLogicalPaths).toContain('*');
    expect(visitedPaths).toContain(
      'paths./schema.get.responses.200.content.application/json.schema'
    );
    expect(visitedPaths).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema'
    );
    expect(visitedPaths).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.not'
    );
    expect(visitedPaths).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.allOf.0'
    );
    expect(visitedPaths).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.oneOf.0'
    );
    expect(visitedPaths).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.anyOf.0'
    );
    expect(visitedLogicalPaths.filter(p => p === '').length).toEqual(6);
  });

  it('should validate a schema before validating its composed or nested schemas', async () => {
    const schema = {
      items: {
        allOf: [
          {
            properties: {
              one: {
                oneOf: [
                  {
                    additionalProperties: {
                      anyOf: [
                        {
                          patternProperties: {
                            '^foo$': {
                              not: {},
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    };

    const visitedPaths = [];

    validateSubschemas(schema, [], (s, p) => {
      visitedPaths.push(p.join('.'));
      return [];
    });

    expect(visitedPaths).toEqual([
      '',
      'items',
      'items.allOf.0',
      'items.allOf.0.properties.one',
      'items.allOf.0.properties.one.oneOf.0',
      'items.allOf.0.properties.one.oneOf.0.additionalProperties',
      'items.allOf.0.properties.one.oneOf.0.additionalProperties.anyOf.0',
      'items.allOf.0.properties.one.oneOf.0.additionalProperties.anyOf.0.patternProperties.^foo$',
      'items.allOf.0.properties.one.oneOf.0.additionalProperties.anyOf.0.patternProperties.^foo$.not',
    ]);
  });

  it("should validate a schema's composition parent more recently than its parent's siblings", async () => {
    const schema = {
      allOf: [{ oneOf: [{}] }, { oneOf: [{}] }],
      oneOf: [{ anyOf: [{}] }, { anyOf: [{}] }],
      anyOf: [{ not: {} }, { not: {} }],
      not: { allOf: [{}] },
    };

    const visitedPaths = [];

    validateSubschemas(schema, [], (s, p) => {
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

  it("should validate a schema's nesting parent more recently than its parent's siblings", async () => {
    const schema = {
      allOf: [
        {
          items: { additionalProperties: {} },
          additionalProperties: { patternProperties: { '^baz$': {} } },
        },
        {
          additionalProperties: { patternProperties: { '^baz$': {} } },
          patternProperties: {
            '^foo$': { properties: { baz: {} } },
            '^bar$': { properties: { baz: {} } },
          },
        },
      ],
      oneOf: [
        {
          additionalProperties: { patternProperties: { '^baz$': {} } },
          patternProperties: {
            '^foo$': { properties: { baz: {} } },
            '^bar$': { properties: { baz: {} } },
          },
        },
        {
          patternProperties: {
            '^foo$': { properties: { baz: {} } },
            '^bar$': { properties: { baz: {} } },
          },
          properties: {
            a: {},
            one: { items: {} },
            z: {},
          },
        },
      ],
      anyOf: [
        {
          patternProperties: {
            '^foo$': { properties: { baz: {} } },
            '^bar$': { properties: { baz: {} } },
          },
          properties: {
            a: {},
            one: { items: {} },
            z: {},
          },
        },
        {
          properties: {
            a: {},
            one: { items: {} },
            z: {},
          },
          items: { additionalProperties: {} },
        },
      ],
      not: {
        properties: {
          a: {},
          one: { items: {} },
          z: {},
        },
        items: { additionalProperties: {} },
      },
    };

    const visitedPaths = [];

    validateSubschemas(schema, [], (s, p) => {
      visitedPaths.push(p.join('.'));
      return [];
    });

    expect(
      visitedPaths.indexOf('allOf.0.items.additionalProperties') - 1
    ).toEqual(visitedPaths.indexOf('allOf.0.items'));
    expect(
      visitedPaths.indexOf(
        'allOf.0.additionalProperties.patternProperties.^baz$'
      ) - 1
    ).toEqual(visitedPaths.indexOf('allOf.0.additionalProperties'));
    expect(
      visitedPaths.indexOf(
        'allOf.1.additionalProperties.patternProperties.^baz$'
      ) - 1
    ).toEqual(visitedPaths.indexOf('allOf.1.additionalProperties'));
    expect(
      visitedPaths.indexOf('allOf.1.patternProperties.^foo$.properties.baz') - 1
    ).toEqual(visitedPaths.indexOf('allOf.1.patternProperties.^foo$'));
    expect(
      visitedPaths.indexOf(
        'oneOf.0.additionalProperties.patternProperties.^baz$'
      ) - 1
    ).toEqual(visitedPaths.indexOf('oneOf.0.additionalProperties'));
    expect(
      visitedPaths.indexOf('oneOf.0.patternProperties.^foo$.properties.baz') - 1
    ).toEqual(visitedPaths.indexOf('oneOf.0.patternProperties.^foo$'));
    expect(
      visitedPaths.indexOf('oneOf.1.patternProperties.^foo$.properties.baz') - 1
    ).toEqual(visitedPaths.indexOf('oneOf.1.patternProperties.^foo$'));
    expect(visitedPaths.indexOf('oneOf.1.properties.one.items') - 1).toEqual(
      visitedPaths.indexOf('oneOf.1.properties.one')
    );
    expect(
      visitedPaths.indexOf('anyOf.0.patternProperties.^foo$.properties.baz') - 1
    ).toEqual(visitedPaths.indexOf('anyOf.0.patternProperties.^foo$'));
    expect(visitedPaths.indexOf('anyOf.0.properties.one.items') - 1).toEqual(
      visitedPaths.indexOf('anyOf.0.properties.one')
    );
    expect(visitedPaths.indexOf('anyOf.1.properties.one.items') - 1).toEqual(
      visitedPaths.indexOf('anyOf.1.properties.one')
    );
    expect(
      visitedPaths.indexOf('anyOf.1.items.additionalProperties') - 1
    ).toEqual(visitedPaths.indexOf('anyOf.1.items'));
    expect(visitedPaths.indexOf('not.properties.one.items') - 1).toEqual(
      visitedPaths.indexOf('not.properties.one')
    );
    expect(visitedPaths.indexOf('not.items.additionalProperties') - 1).toEqual(
      visitedPaths.indexOf('not.items')
    );
  });
});
