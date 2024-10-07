/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { discriminatorPropertyExists } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-discriminator-property';
const rule = discriminatorPropertyExists;

const expectedMsg = /Discriminator property must be defined in the schema: /;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    // tests oneOf with all properties containing the property
    const results = await testRule(ruleId, rule, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if property is present in all oneOf nested subschemas', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.components.schemas.Soda = {
      oneOf: [
        {
          type: 'object',
          properties: {
            type: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            type: {
              type: 'string',
            },
          },
        },
      ],
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if property is present in all anyOf nested subschemas', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.components.schemas.Soda = {
      anyOf: [
        {
          type: 'object',
          properties: {
            type: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            type: {
              type: 'string',
            },
          },
        },
      ],
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if property is present in at least one allOf nested subschemas', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.components.schemas.Soda = {
      allOf: [
        {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            type: {
              type: 'string',
            },
          },
        },
      ],
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if all anyOf properties have a schema', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.components.schemas.Drink = {
      anyOf: [
        {
          $ref: '#/components/schemas/Juice',
        },
        {
          $ref: '#/components/schemas/Soda',
        },
      ],
      discriminator: {
        propertyName: 'type',
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should error if discriminator is not present in all oneOf subschemas', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.components.schemas.Soda = {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          $ref: '#/components/schemas/NormalString',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);
    expect(results).toHaveLength(4);

    const expectedPaths = [
      'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.discriminator.propertyName',
      'paths./v1/drinks.post.requestBody.content.application/json.schema.discriminator.propertyName',
      'paths./v1/drinks.post.responses.201.content.application/json.schema.discriminator.propertyName',
      'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.discriminator.propertyName',
    ];
    for (let i = 0; i < results.length; i++) {
      expect(results[i].code).toBe(ruleId);
      expect(results[i].message).toMatch(expectedMsg);
      expect(results[i].severity).toBe(severityCodes.error);
      expect(results[i].path.join('.')).toBe(expectedPaths[i]);
    }
  });

  it('should error if discriminator is not present in all anyOf subschemas', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.components.schemas.Drink = {
      anyOf: [
        {
          $ref: '#/components/schemas/Juice',
        },
        {
          $ref: '#/components/schemas/Soda',
        },
      ],
      discriminator: {
        propertyName: 'type',
      },
    };

    testDocument.components.schemas.Juice = {
      type: 'object',
      required: ['fruit'],
      properties: {
        fruit: {
          $ref: '#/components/schemas/NormalString',
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);
    expect(results).toHaveLength(4);

    const expectedPaths = [
      'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.discriminator.propertyName',
      'paths./v1/drinks.post.requestBody.content.application/json.schema.discriminator.propertyName',
      'paths./v1/drinks.post.responses.201.content.application/json.schema.discriminator.propertyName',
      'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.discriminator.propertyName',
    ];
    for (let i = 0; i < results.length; i++) {
      expect(results[i].code).toBe(ruleId);
      expect(results[i].message).toMatch(expectedMsg);
      expect(results[i].severity).toBe(severityCodes.error);
      expect(results[i].path.join('.')).toBe(expectedPaths[i]);
    }
  });

  it('should error if discriminator is not present in all oneOf nested subschemas', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.components.schemas.Soda = {
      oneOf: [
        {
          type: 'object',
          properties: {
            brand: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            type: {
              type: 'string',
            },
          },
        },
      ],
    };

    const results = await testRule(ruleId, rule, testDocument);
    expect(results).toHaveLength(4);

    const expectedPaths = [
      'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.discriminator.propertyName',
      'paths./v1/drinks.post.requestBody.content.application/json.schema.discriminator.propertyName',
      'paths./v1/drinks.post.responses.201.content.application/json.schema.discriminator.propertyName',
      'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.discriminator.propertyName',
    ];
    for (let i = 0; i < results.length; i++) {
      expect(results[i].code).toBe(ruleId);
      expect(results[i].message).toMatch(expectedMsg);
      expect(results[i].severity).toBe(severityCodes.error);
      expect(results[i].path.join('.')).toBe(expectedPaths[i]);
    }
  });

  it('should error if property is not present in all anyOf nested subschemas', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.components.schemas.Soda = {
      anyOf: [
        {
          type: 'object',
          properties: {
            brand: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            type: {
              type: 'string',
            },
          },
        },
      ],
    };

    const results = await testRule(ruleId, rule, testDocument);
    expect(results).toHaveLength(4);

    const expectedPaths = [
      'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.discriminator.propertyName',
      'paths./v1/drinks.post.requestBody.content.application/json.schema.discriminator.propertyName',
      'paths./v1/drinks.post.responses.201.content.application/json.schema.discriminator.propertyName',
      'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.discriminator.propertyName',
    ];
    for (let i = 0; i < results.length; i++) {
      expect(results[i].code).toBe(ruleId);
      expect(results[i].message).toMatch(expectedMsg);
      expect(results[i].severity).toBe(severityCodes.error);
      expect(results[i].path.join('.')).toBe(expectedPaths[i]);
    }
  });

  it('should not error if property is present in at least one allOf nested subschemas', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.components.schemas.Soda = {
      allOf: [
        {
          type: 'object',
          properties: {
            brand: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            flavor: {
              type: 'string',
            },
          },
        },
      ],
    };

    const results = await testRule(ruleId, rule, testDocument);
    expect(results).toHaveLength(4);

    const expectedPaths = [
      'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.discriminator.propertyName',
      'paths./v1/drinks.post.requestBody.content.application/json.schema.discriminator.propertyName',
      'paths./v1/drinks.post.responses.201.content.application/json.schema.discriminator.propertyName',
      'paths./v1/drinks/{drink_id}.get.responses.200.content.application/json.schema.discriminator.propertyName',
    ];
    for (let i = 0; i < results.length; i++) {
      expect(results[i].code).toBe(ruleId);
      expect(results[i].message).toMatch(expectedMsg);
      expect(results[i].severity).toBe(severityCodes.error);
      expect(results[i].path.join('.')).toBe(expectedPaths[i]);
    }
  });
});
