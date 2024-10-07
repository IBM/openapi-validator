/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getCompositeSchemaAttribute } = require('../../src/utils');

describe('Utility function: getCompositeSchemaAttribute()', () => {
  it('Boundary conditions', async () => {
    expect(getCompositeSchemaAttribute(undefined, undefined)).toBe(undefined);
    expect(getCompositeSchemaAttribute(undefined, null)).toBe(undefined);
    expect(getCompositeSchemaAttribute(null, undefined)).toBe(undefined);
    expect(getCompositeSchemaAttribute(null, null)).toBe(undefined);
  });

  it('Should return attribute within non-composed schema', async () => {
    const schema = {
      type: 'string',
      format: 'date-time',
    };
    expect(getCompositeSchemaAttribute(schema, 'format')).toBe('date-time');
    expect(getCompositeSchemaAttribute(schema, 'type')).toBe('string');
  });

  it('Should return `undefined` for a schema with empty `allOf`', async () => {
    const schema = { allOf: [] };
    expect(getCompositeSchemaAttribute(schema, 'type')).toBe(undefined);
  });

  it('Should return `undefined` for a schema with empty `anyOf`', async () => {
    const schema = { anyOf: [] };
    expect(getCompositeSchemaAttribute(schema, 'type')).toBe(undefined);
  });

  it('Should return `undefined` for a schema with empty `oneOf`', async () => {
    const schema = { oneOf: [] };
    expect(getCompositeSchemaAttribute(schema, 'type')).toBe(undefined);
  });

  it('Should return attribute if present in one of the allOf schemas', async () => {
    const schema = {
      allOf: [
        {
          type: 'string',
        },
        {
          format: 'byte',
        },
      ],
    };
    expect(getCompositeSchemaAttribute(schema, 'type')).toBe('string');
    expect(getCompositeSchemaAttribute(schema, 'format')).toBe('byte');
  });

  it('Should return attribute if present in each of the anyOf schemas', async () => {
    const schema = {
      anyOf: [
        {
          type: 'string',
          format: 'byte',
        },
        {
          type: 'string',
        },
      ],
    };
    expect(getCompositeSchemaAttribute(schema, 'type')).toBe('string');
    expect(getCompositeSchemaAttribute(schema, 'format')).toBe(undefined);
  });

  it('Should return attribute if present in each of the oneOf schemas', async () => {
    const schema = {
      oneOf: [
        {
          type: 'string',
          format: 'byte',
        },
        {
          type: 'string',
        },
      ],
    };
    expect(getCompositeSchemaAttribute(schema, 'type')).toBe('string');
    expect(getCompositeSchemaAttribute(schema, 'format')).toBe(undefined);
  });

  it('Should recurse through `oneOf` and `allOf`', async () => {
    const schema = {
      oneOf: [
        {
          allOf: [{ type: 'string' }, { format: 'byte' }],
        },
        {
          type: 'string',
        },
      ],
    };
    expect(getCompositeSchemaAttribute(schema, 'type')).toBe('string');
    expect(getCompositeSchemaAttribute(schema, 'format')).toBe(undefined);
  });

  it('Should recurse through `anyOf` and `allOf`', async () => {
    const schema = {
      anyOf: [
        {
          allOf: [{ type: 'string' }, { format: 'byte' }],
        },
        {
          type: 'string',
        },
      ],
    };
    expect(getCompositeSchemaAttribute(schema, 'type')).toBe('string');
    expect(getCompositeSchemaAttribute(schema, 'format')).toBe(undefined);
  });

  it('Should recurse through `allOf` and `oneOf`', async () => {
    const schema = {
      allOf: [
        {
          oneOf: [{ type: 'string', format: 'uri' }, { type: 'string' }],
        },
        {
          format: 'byte',
        },
      ],
    };
    expect(getCompositeSchemaAttribute(schema, 'type')).toBe('string');
    expect(getCompositeSchemaAttribute(schema, 'format')).toBe('byte');
  });
});
