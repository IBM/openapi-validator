const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/swagger2/semantic-validators/parameters');

describe('validation plugin - semantic - parameters', () => {
  it('should return an error when an array type parameter omits an `items` property', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                name: 'tags',
                in: 'query',
                description: 'tags to filter by',
                type: 'array'
              }
            ]
          }
        }
      }
    };

    const res = validate({ resolvedSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'parameters',
      '0'
    ]);
    expect(res.errors[0].message).toEqual(
      "Parameters with 'array' type require an 'items' property."
    );
    expect(res.warnings.length).toEqual(0);
  });
});
