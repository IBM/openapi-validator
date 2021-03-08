const expect = require('expect');
const isPrimitiveType = require('../../../src/plugins/utils/isPrimitiveType');

describe('isPrimitiveType - util', () => {
  it('should return true when the schema uses a primitive type', () => {
    const exampleObject = {
      schema: {
        type: 'string'
      }
    };

    expect(isPrimitiveType(exampleObject.schema)).toBe(true);
  });

  it('should return true when given items with a primitive type', () => {
    const exampleObject = {
      schema: {
        type: 'array',
        items: {
          type: 'boolean'
        }
      }
    };

    expect(isPrimitiveType(exampleObject.schema.items)).toBe(true);
  });

  it('should return false when the schema uses a non-primitive type', () => {
    const exampleObject = {
      schema: {
        type: 'object',
        properties: {
          exampleProp: {
            type: 'string'
          }
        }
      }
    };

    expect(isPrimitiveType(exampleObject.schema)).toBe(false);
  });
});
