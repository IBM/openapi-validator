const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/swagger2/semantic-validators/swagger');

describe('validation plugin - semantic - swagger', () => {
  //this is for openapi object
  it('should return an error when an API definition does not have swagger field', () => {
    const spec = {
      Swagger: '2.0'
    };

    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(['swagger']);
    expect(res.errors[0].message).toEqual(
      'API definition must have an `swagger` field'
    );
  });

  it('should return an error when an swagger field is not a string', () => {
    const spec = {
      swagger: 123
    };

    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(['swagger']);
    expect(res.errors[0].message).toEqual(
      'API definition must have an `swagger` field as type string'
    );
  });

  it('should return an error when an swagger field does not have value `2.0`', () => {
    const spec = {
      swagger: '2.0.0'
    };

    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(['swagger']);
    expect(res.errors[0].message).toEqual(
      '`swagger` string must have the value `2.0`'
    );
  });
});
