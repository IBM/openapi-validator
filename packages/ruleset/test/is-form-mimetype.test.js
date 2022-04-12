const { isFormMimeType } = require('../src/utils');

describe('Utility function: isFormMimeType()', () => {
  it('should return `false` for `undefined`', async () => {
    expect(isFormMimeType(undefined)).toBe(false);
  });

  it('should return `false` for `null`', async () => {
    expect(isFormMimeType(null)).toBe(false);
  });

  it('should return `false` for empty-string', async () => {
    expect(isFormMimeType('')).toBe(false);
  });

  it('should return `false` for non-form mimetype', async () => {
    expect(isFormMimeType('application/octect-stream')).toBe(false);
    expect(isFormMimeType('text/plain')).toBe(false);
    expect(isFormMimeType('application/json; charset=utf-8')).toBe(false);
  });

  it('should return `true` for a form-based mimetype', async () => {
    expect(isFormMimeType('multipart/form-data')).toBe(true);
    expect(isFormMimeType('multipart/form-data; charset=utf-8')).toBe(true);
    expect(isFormMimeType('multipart/mixed')).toBe(true);
    expect(isFormMimeType('multipart/related')).toBe(true);
    expect(
      isFormMimeType('application/x-www-form-urlencoded; extrabits=xyz')
    ).toBe(true);
  });
});
