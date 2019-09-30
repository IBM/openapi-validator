const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/swagger2/semantic-validators/discriminator');

describe('validation plugin - semantic - swagger 2 discriminator', () => {
  it('should not return errors when schema is defined correctly', () => {
    const spec = {
      components: {
        schemas: {
          Pet: {
            discriminator: 'petType',
            properties: {
              petType: {
                type: 'string'
              }
            }
          }
        }
      }
    };
    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(0);
  });

  it('should return an error when a schema has discriminator that is not type string', () => {
    const spec = {
      components: {
        schemas: {
          Pet: {
            discriminator: {}
        },
          Food: {
            discriminator: 123
          }
        }
      }
    };
    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(2);
    expect(res.errors[0].path).toEqual(
      ['components', 'schemas', 'Pet', 'discriminator'].join('.')
    );
    expect(res.errors[0].message).toEqual(
      'Discriminator must be of type string'
    );

    expect(res.errors[1].path).toEqual(
      ['components', 'schemas', 'Food', 'discriminator'].join('.')
    );
    expect(res.errors[1].message).toEqual(
      'Discriminator must be of type string'
    );
  });

  it('should return an error when property is defined in discriminator but not in schema properties', () => {
    const spec = {
      components: {
        schemas: {
          Pet: {
            discriminator: 'petType',
            properties: {
              name: {
                type: 'string'
              }
            }
          }
        }
      }
    };
    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(1);
    expect(res.errors[0].path).toEqual(
      ['components', 'schemas', 'Pet', 'discriminator'].join(
        '.'
      )
    );
    expect(res.errors[0].message).toEqual(
      'The discriminator defined must also be defined as a property in this schema'
    );

  });
});
