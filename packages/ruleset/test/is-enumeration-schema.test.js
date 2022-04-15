const { isEnumerationSchema } = require('../src/utils');

describe('Utility function: isEnumerationSchema()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isEnumerationSchema(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isEnumerationSchema(null)).toBe(false);
  });

  it('should return `false` for an array', async () => {
    expect(isEnumerationSchema([])).toBe(false);
  });

  it('should return `false` for an empty object', async () => {
    expect(isEnumerationSchema({})).toBe(false);
  });

  it('should return `true` for an object with an `enum` array of strings', async () => {
    expect(isEnumerationSchema({ enum: ['foo', 'bar'] })).toBe(true);
  });

  it('should return `false` for an object with an `enum` array of numbers', async () => {
    expect(isEnumerationSchema({ enum: [1, 2, 3] })).toBe(false);
  });

  it('should return `false` for an object with an `enum` array of booleans', async () => {
    expect(isEnumerationSchema({ enum: [true, false] })).toBe(false);
  });

  it('should return `false` for an object with an `enum` array of objects', async () => {
    expect(isEnumerationSchema({ enum: [{}, {}] })).toBe(false);
  });

  it('should return `false` for an object with an `enum` array of mixed types', async () => {
    expect(isEnumerationSchema({ enum: ['foo', 3] })).toBe(false);
  });

  it('should recurse through `oneOf` and `allOf` and `anyOf`', async () => {
    expect(
      isEnumerationSchema({
        oneOf: [
          {
            allOf: [{ anyOf: [{ enum: ['one'] }, { enum: ['two'] }] }, {}]
          },
          { enum: ['three'] }
        ]
      })
    ).toBe(true);
  });
});
