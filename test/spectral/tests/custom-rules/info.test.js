const inCodeValidator = require('../../../../src/lib');

describe('spectral - test that error produced for missing info object', function() {
  it('should return an error when the spec does not include info obect', async () => {
    const spec = {
      Openapi: '3.0.0',
      paths: {}
    };

    const res = await inCodeValidator(spec, true);
    const expectedError = res.errors.filter(
      error => error.message === 'API definition must have an `info` object'
    );
    expect(expectedError.length).toBe(1);
  });

  it('should return an error when a info is not defined as a proper object', async () => {
    const spec = {
      Openapi: '3.0.0',
      info: 'abc',
      paths: {}
    };

    const res = await inCodeValidator(spec, true);
    const expectedError = res.errors.filter(
      error => error.message === 'API definition must have an `info` object'
    );
    expect(expectedError.length).toBe(1);
  });

  it('should not error when info is provided as an object', async () => {
    const spec = {
      Openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Info Test'
      },
      paths: {}
    };

    const res = await inCodeValidator(spec, true);
    const errors = res.errors.map(error => error.message);
    expect(errors).not.toContain('API definition must have an `info` object');
  });
});
