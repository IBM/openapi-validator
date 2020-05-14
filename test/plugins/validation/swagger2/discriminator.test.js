const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/swagger2/semantic-validators/discriminator');

describe('validation plugin - semantic - swagger2 discriminator', () => {
  it('should not return errors when schema is defined correctly', () => {
    const spec = {
      definitions: {
        Pet: {
          type: 'object',
          discriminator: 'petType',
          properties: {
            petType: {
              type: 'string'
            }
          },
          required: ['petType']
        }
      }
    };
    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(0);
  });

  it('should return an error when a schema has discriminator that is not type string', () => {
    const spec = {
      definitions: {
        Pet: {
          type: 'object',
          discriminator: {}
        },
        Food: {
          type: 'object',
          discriminator: 123
        }
      }
    };
    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(2);
    expect(res.errors[0].path).toEqual(
      ['definitions', 'Pet', 'discriminator'].join('.')
    );
    expect(res.errors[0].message).toEqual(
      'Discriminator must be of type string'
    );

    expect(res.errors[1].path).toEqual(
      ['definitions', 'Food', 'discriminator'].join('.')
    );
    expect(res.errors[1].message).toEqual(
      'Discriminator must be of type string'
    );
  });

  it('should return an error when property is defined in discriminator but not in schema properties', () => {
    const spec = {
      definitions: {
        Pet: {
          type: 'object',
          discriminator: 'petType',
          properties: {
            type: {
              type: 'string'
            }
          }
        }
      }
    };
    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(
      ['definitions', 'Pet', 'discriminator'].join('.')
    );
    expect(res.errors[0].message).toEqual(
      'The discriminator defined must also be defined as a property in this schema'
    );
  });

  it('should return an error when required is not found', () => {
    const spec = {
      definitions: {
        Pet: {
          type: 'object',
          discriminator: 'petType',
          properties: {
            petType: {
              type: 'string'
            }
          }
        }
      }
    };
    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(['definitions', 'Pet'].join('.'));
    expect(res.errors[0].message).toEqual(
      'Required array not found. The discriminator defined must also be part of required properties'
    );
  });

  it('should return an error when required is an array', () => {
    const spec = {
      definitions: {
        Pet: {
          type: 'object',
          discriminator: 'petType',
          properties: {
            petType: {
              type: 'string'
            }
          },
          required: {}
        },
        Food: {
          type: 'object',
          discriminator: 'foodType',
          properties: {
            foodType: {
              type: 'string'
            }
          },
          required: 123
        }
      }
    };
    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(2);
    expect(res.errors[0].path).toEqual(
      ['definitions', 'Pet', 'required'].join('.')
    );
    expect(res.errors[0].message).toEqual('Required must be an array');
    expect(res.errors[1].path).toEqual(
      ['definitions', 'Food', 'required'].join('.')
    );
    expect(res.errors[1].message).toEqual('Required must be an array');
  });

  it('should return an error when discriminator is not listed in required', () => {
    const spec = {
      definitions: {
        Pet: {
          type: 'object',
          discriminator: 'petType',
          properties: {
            petType: {
              type: 'string'
            }
          },
          required: ['name']
        }
      }
    };
    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(
      ['definitions', 'Pet', 'required'].join('.')
    );
    expect(res.errors[0].message).toEqual(
      'Discriminator is not listed as part of required'
    );
  });
});
