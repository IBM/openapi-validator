const mergeAllOfSchemaProperties = require('../../../src/plugins/utils/mergeAllOfSchemaProperties');

describe('mergeAllOfSchemaProperties - util', () => {
  it('should not overwrite original values, should merge all properties, and should not modify original schema', () => {
    const exampleObject = {
      schema: {
        description: 'original description',
        type: 'object',
        properties: {
          prop1: {
            type: 'string'
          },
          prop2: {
            type: 'integer'
          }
        },
        allOf: [
          {
            description: 'description should not overwrite',
            type: 'object1', // test that type stays as 'object'
            properties: {
              prop3: {
                type: 'number'
              },
              prop4: {
                type: 'boolean'
              }
            }
          },
          {
            description: 'description should not overwrite',
            type: 'object1', // test that type stays as 'object'
            properties: {
              prop5: {
                type: 'number'
              },
              prop6: {
                type: 'boolean'
              }
            }
          }
        ]
      }
    };

    const origSchema = exampleObject.schema;
    const mergedSchema = mergeAllOfSchemaProperties(exampleObject.schema);

    expect(exampleObject.schema).toBe(origSchema); // original schema not modified

    expect(mergedSchema.description).toEqual('original description');
    expect(mergedSchema.type).toEqual('object');

    expect(mergedSchema.properties).toHaveProperty('prop1');
    expect(mergedSchema.properties).toHaveProperty('prop2');
    expect(mergedSchema.properties).toHaveProperty('prop3');
    expect(mergedSchema.properties).toHaveProperty('prop4');
    expect(mergedSchema.properties).toHaveProperty('prop5');
    expect(mergedSchema.properties).toHaveProperty('prop6');
  });

  it('should properly merge arrays', () => {
    const exampleObject = {
      schema: {
        required: ['prop1', 'prop2'],
        description: 'original description',
        type: 'object',
        properties: {
          prop1: {
            type: 'string'
          },
          prop2: {
            type: 'integer'
          }
        },
        allOf: [
          {
            required: ['prop3', 'prop4'],
            description: 'description should not overwrite',
            type: 'object1', // test that type stays as 'object'
            properties: {
              prop3: {
                type: 'number'
              },
              prop4: {
                type: 'boolean'
              }
            }
          },
          {
            required: ['prop5', 'prop6'],
            description: 'description should not overwrite',
            type: 'object1', // test that type stays as 'object'
            properties: {
              prop5: {
                type: 'number'
              },
              prop6: {
                type: 'boolean'
              }
            }
          }
        ]
      }
    };

    const origSchema = exampleObject.schema;
    const mergedSchema = mergeAllOfSchemaProperties(exampleObject.schema);

    expect(exampleObject.schema).toBe(origSchema); // original schema not modified

    expect(mergedSchema.required).toEqual([
      'prop1',
      'prop2',
      'prop3',
      'prop4',
      'prop5',
      'prop6'
    ]);
  });
});
