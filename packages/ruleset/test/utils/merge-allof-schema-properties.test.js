/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { mergeAllOfSchemaProperties } = require('../../src/utils');

describe('Utility function: mergeAllOfSchemaProperties()', () => {
  it('should return original schema if no allOf', async () => {
    const schema = {
      description: 'the description',
      type: 'object',
      required: ['prop1'],
      properties: {
        prop1: {
          type: 'string',
        },
      },
    };
    expect(mergeAllOfSchemaProperties(schema)).toStrictEqual(schema);
  });

  it('should return original schema (minum allOf) if empty allOf', async () => {
    const schema = {
      description: 'the description',
      type: 'object',
      required: ['prop1'],
      properties: {
        prop1: {
          type: 'string',
        },
      },
      allOf: [],
    };

    const result = mergeAllOfSchemaProperties(schema);
    delete schema.allOf;
    expect(result).toStrictEqual(schema);
  });

  it('should return correct merged schema if non-empty allOf', async () => {
    const schema = {
      description: 'the description',
      type: 'object',
      required: ['prop1'],
      properties: {
        prop1: {
          type: 'string',
        },
      },
      allOf: [
        {
          type: 'object',
          description: 'allOf[0]',
          required: ['prop2'],
          properties: {
            prop2: {
              type: 'integer',
            },
          },
        },
        {
          type: 'object',
          description: 'allOf[1]',
          properties: {
            prop3: {
              type: 'boolean',
            },
          },
        },
      ],
    };

    const expectedResult = {
      description: 'the description',
      type: 'object',
      required: ['prop2', 'prop1'],
      properties: {
        prop1: {
          type: 'string',
        },
        prop2: {
          type: 'integer',
        },
        prop3: {
          type: 'boolean',
        },
      },
    };

    expect(mergeAllOfSchemaProperties(schema)).toStrictEqual(expectedResult);
  });

  it('should return correct page-link schema', async () => {
    const schema = {
      allOf: [
        {
          type: 'object',
          description: 'pagelink schema',
          required: ['href'],
          properties: {
            href: {
              type: 'string',
              description: 'the href property',
              example: 'the wrong href example',
            },
          },
        },
      ],
      description: 'a link to the first page of results',
      properties: {
        href: {
          example: 'the correct href example',
        },
      },
    };

    const expectedResult = {
      description: 'a link to the first page of results',
      type: 'object',
      required: ['href'],
      properties: {
        href: {
          type: 'string',
          description: 'the href property',
          example: 'the correct href example',
        },
      },
    };

    expect(mergeAllOfSchemaProperties(schema)).toStrictEqual(expectedResult);
  });

  it('should return correct merged paginated response schema', async () => {
    const schema = {
      allOf: [
        {
          description: 'Pagination base properties',
          type: 'object',
          required: ['limit', 'offset'],
          properties: {
            limit: {
              description: 'The limit.',
              type: 'integer',
              default: 10,
              minimum: 1,
              maximum: 100,
            },
            offset: {
              description: 'The offset.',
              type: 'integer',
              default: 0,
              minimum: 0,
            },
          },
        },
        {
          type: 'object',
          required: ['resources'],
          description: 'A paginated response schema',
          properties: {
            resources: {
              description: 'The resources contained in a page of list results.',
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      ],
    };

    const expectedResult = {
      type: 'object',
      description: 'A paginated response schema',
      required: ['limit', 'offset', 'resources'],
      properties: {
        limit: {
          description: 'The limit.',
          type: 'integer',
          default: 10,
          minimum: 1,
          maximum: 100,
        },
        offset: {
          description: 'The offset.',
          type: 'integer',
          default: 0,
          minimum: 0,
        },
        resources: {
          description: 'The resources contained in a page of list results.',
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    };

    expect(mergeAllOfSchemaProperties(schema)).toStrictEqual(expectedResult);
  });

  it('should return correct merged schema if nested allOf', async () => {
    const schema = {
      description: 'the description',
      type: 'object',
      required: ['prop1'],
      properties: {
        prop1: {
          type: 'string',
        },
      },
      allOf: [
        {
          type: 'object',
          description: 'allOf[0]',
          required: ['prop2'],
          properties: {
            prop2: {
              type: 'integer',
            },
          },
          allOf: [
            {
              description: 'allOf[0][0]',
              properties: {
                prop2a: {
                  type: 'string',
                },
              },
              allOf: [
                {
                  description: 'allOf[0][0][0]',
                  properties: {
                    prop2aa: {
                      type: 'string',
                    },
                  },
                },
              ],
            },
            {
              description: 'allOf[0][1]',
              properties: {
                prop2b: {
                  type: 'integer',
                },
              },
            },
          ],
        },
        {
          type: 'object',
          description: 'allOf[1]',
          properties: {
            prop3: {
              type: 'boolean',
            },
          },
        },
      ],
    };

    const expectedResult = {
      description: 'the description',
      type: 'object',
      required: ['prop2', 'prop1'],
      properties: {
        prop1: {
          type: 'string',
        },
        prop2: {
          type: 'integer',
        },
        prop2a: {
          type: 'string',
        },
        prop2aa: {
          type: 'string',
        },
        prop2b: {
          type: 'integer',
        },
        prop3: {
          type: 'boolean',
        },
      },
    };

    expect(mergeAllOfSchemaProperties(schema)).toStrictEqual(expectedResult);
  });
});
