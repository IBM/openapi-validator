const { isJsonMimeType } = require('../src/utils');

describe('Utility function: isJsonMimeType()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isJsonMimeType(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isJsonMimeType(null)).toBe(false);
  });

  it('should return `false` for empty-string', async () => {
    expect(isJsonMimeType('')).toBe(false);
  });

  it('should return `false` for non-JSON mimetype', async () => {
    expect(isJsonMimeType('application/octect-stream')).toBe(false);
    expect(isJsonMimeType('text/plain')).toBe(false);
    expect(isJsonMimeType('multipart/form-data; charset=utf-8')).toBe(false);
  });

  it('should return `true` for a JSON mimetype', async () => {
    expect(isJsonMimeType('application/json')).toBe(true);
    expect(isJsonMimeType('application/json;charset=utf-8')).toBe(true);
  });
});
