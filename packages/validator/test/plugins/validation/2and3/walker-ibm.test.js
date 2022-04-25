const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/walker-ibm');
const config = require('../../../../src/.defaultsForValidator').defaults.shared;

describe('validation plugin - semantic - walker-ibm', () => {
  it('should return an error when a non-default property contains a null value', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                name: 'tags',
                in: 'query',
                description: null,
                type: 'string'
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual([
      'paths',
      '/pets',
      'get',
      'parameters',
      '0',
      'description'
    ]);
    expect(res.errors[0].message).toEqual(
      'Null values are not allowed for any property.'
    );
    expect(res.warnings.length).toEqual(0);
  });

  it('should not return an error when the default property contains a null value', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                name: 'tags',
                in: 'query',
                default: null,
                type: 'string'
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });

  it('should not return an error when the enum property contains a null value', () => {
    const spec = {
      paths: {
        '/pets': {
          get: {
            parameters: [
              {
                name: 'tags',
                in: 'query',
                nullable: true,
                type: 'string',
                enum: ['FOO', 'BAR', null]
              }
            ]
          }
        }
      }
    };

    const res = validate({ jsSpec: spec }, config);
    expect(res.errors.length).toEqual(0);
    expect(res.warnings.length).toEqual(0);
  });
});
