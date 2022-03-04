const { mergeAllOfSchemaProperties } = require('../src/utils');

describe('Utility function: mergeAllOfSchemaProperties()', () => {
  it('should return original schema if no allOf', async () => {
    const schema = {
      description: 'the description',
      type: 'object',
      required: ['prop1'],
      properties: {
        prop1: {
          type: 'string'
        }
      }
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
          type: 'string'
        }
      },
      allOf: []
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
          type: 'string'
        }
      },
      allOf: [
        {
          type: 'object',
          description: 'allOf[0]',
          required: ['prop2'],
          properties: {
            prop2: {
              type: 'integer'
            }
          }
        },
        {
          type: 'object',
          description: 'allOf[1]',
          properties: {
            prop3: {
              type: 'boolean'
            }
          }
        }
      ]
    };

    const expectedResult = {
      description: 'the description',
      type: 'object',
      required: ['prop1', 'prop2'],
      properties: {
        prop1: {
          type: 'string'
        },
        prop2: {
          type: 'integer'
        },
        prop3: {
          type: 'boolean'
        }
      }
    };

    expect(mergeAllOfSchemaProperties(schema)).toStrictEqual(expectedResult);
  });

  it('should return correct merged paginated response schema', async () => {
    const schema = {
      description: 'A paginated response schema',
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
              maximum: 100
            },
            offset: {
              description: 'The offset.',
              type: 'integer',
              default: 0,
              minimum: 0
            }
          }
        },
        {
          type: 'object',
          required: ['resources'],
          properties: {
            resources: {
              description: 'The resources contained in a page of list results.',
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        }
      ]
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
          maximum: 100
        },
        offset: {
          description: 'The offset.',
          type: 'integer',
          default: 0,
          minimum: 0
        },
        resources: {
          description: 'The resources contained in a page of list results.',
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    };

    expect(mergeAllOfSchemaProperties(schema)).toStrictEqual(expectedResult);
  });
});
