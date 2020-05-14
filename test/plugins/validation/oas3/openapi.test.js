const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/oas3/semantic-validators/openapi');

describe('validation plugin - semantic - openapi', () => {
  //this is for openapi object
  it('should return an error when an API definition does not have openapi field', () => {
    const spec = {
      Openapi: '3.0.0'
    };

    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(['openapi']);
    expect(res.errors[0].message).toEqual(
      'API definition must have an `openapi` field'
    );
  });

  it('should return an error when an openapi field is not a string', () => {
    const spec = {
      openapi: 123
    };

    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(['openapi']);
    expect(res.errors[0].message).toEqual(
      'API definition must have an `openapi` field as type string'
    );
  });

  it('should return an error when an openapi does not conform to semantic versioning 2.0.0', () => {
    const spec = {
      openapi: 'v1.0.10'
    };

    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(['openapi']);
    expect(res.errors[0].message).toEqual(
      '`openapi` string must follow Semantic Versioning 2.0.0'
    );
  });
});
