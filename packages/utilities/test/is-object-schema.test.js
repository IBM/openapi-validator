const { isObjectSchema } = require('../src');

describe('Utility function: isObjectSchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isObjectSchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isObjectSchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isObjectSchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isObjectSchema({})).toBe(false);
  });

  it('should return `true` for an object with `type` of "object"', async () => {
    expect(isObjectSchema({ type: 'object' })).toBe(true);
  });

  // Skipped: debatable whether this test ought to pass, but maybe for OAS 3.1 support
  it.skip('should return `true` for an object with `type` of ["object"]', async () => {
    expect(isObjectSchema({ type: ['object'] })).toBe(true);
  });

  it('should return `true` for an object with no `type` and a `properties` object', async () => {
    expect(isObjectSchema({ properties: {} })).toBe(true);
  });

  it('should return `true` for an object with no `type` and an `additionalProperties` of `true`', async () => {
    expect(isObjectSchema({ additionalProperties: true })).toBe(true);
  });

  it('should return `true` for an object with no `type` and an `additionalProperties` object', async () => {
    expect(isObjectSchema({ additionalProperties: {} })).toBe(true);
  });

  it('should return `false` for an object with non-"object" `type` and an `properties` object', async () => {
    expect(isObjectSchema({ type: 'array', properties: {} })).toBe(false);
  });

  it('should return `false` for an object with no `type` and a non-object `properties`', async () => {
    expect(isObjectSchema({ properties: null })).toBe(false);
  });

  it('should recurse through `oneOf` and `allOf`', async () => {
    expect(
      isObjectSchema({
        oneOf: [
          {
            allOf: [{ properties: {} }, {}]
          },
          { type: 'object' }
        ]
      })
    ).toBe(true);
  });

  it('should recurse through `oneOf` and `allOf` (implicit object type)', async () => {
    expect(
      isObjectSchema({
        oneOf: [
          {
            allOf: [{ properties: {} }, {}]
          },
          {
            properties: {}
          }
        ]
      })
    ).toBe(true);
  });

  it('should recurse through `allOf` (implicit object type)', async () => {
    expect(
      isObjectSchema({
        allOf: [
          {
            allOf: [{ properties: {} }, {}]
          },
          {
            properties: {}
          }
        ]
      })
    ).toBe(true);
  });
});
