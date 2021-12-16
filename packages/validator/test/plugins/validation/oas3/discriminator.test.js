const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/oas3/semantic-validators/discriminator');

describe('validation plugin - semantic - oas3 discriminator', () => {
  it('should not return errors when schema is defined correctly', () => {
    const spec = {
      components: {
        schemas: {
          Pet: {
            discriminator: {
              propertyName: 'petType'
            },
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

  it('should return an error when propertyName is defined inside discriminator object but not in schema properties', () => {
    const spec = {
      components: {
        schemas: {
          Pet: {
            discriminator: {
              propertyName: 'petType'
            },
            properties: {
              name: {
                type: 'string'
              }
            }
          },
          Food: {
            discriminator: {
              propertyName: 'expirationDate'
            },
            properties: {}
          }
        }
      }
    };
    const res = validate({ jsSpec: spec });
    expect(res.errors.length).toEqual(2);
    expect(res.errors[0].path).toEqual(
      ['components', 'schemas', 'Pet', 'discriminator', 'propertyName'].join(
        '.'
      )
    );
    expect(res.errors[0].message).toEqual(
      'The discriminator property name used must be defined in this schema'
    );

    expect(res.errors[1].path).toEqual(
      ['components', 'schemas', 'Food', 'discriminator', 'propertyName'].join(
        '.'
      )
    );
    expect(res.errors[1].message).toEqual(
      'The discriminator property name used must be defined in this schema'
    );
  });
});
