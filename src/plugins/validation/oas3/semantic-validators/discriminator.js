// Assertation 1:
// if discriminator exist inside schema object, it must be of type Object

// Assertion 2:
// discriminator object must have a field name propertyName

// Assertation 3:
// propertyName is of type string

// Assertation 4:
// properties inside a schema object must include propertName from discriminator object

const each = require('lodash/each');
const has = require('lodash/has');
const get = require('lodash/get');

module.exports.validate = function({ jsSpec }) {
  const errors = [];
  const warnings = [];

  const schemas = get(jsSpec, ['components', 'schemas'], []);

  const basePath = ['components', 'schemas'];

  each(schemas, (schema, schemaName) => {
    if (has(schema, 'discriminator')) {
      const { discriminator } = schema;

      // If discriminator is not an object, error out and return
      if (typeof discriminator === 'object') {
        if (!has(discriminator, 'propertyName')) {
          errors.push({
            path: basePath.concat([schemaName, 'discriminator']).join('.'),
            message:
              'Discriminator must be of type object with field name propertyName'
          });
          return;
        }
      } else {
        errors.push({
          path: basePath.concat([schemaName, 'discriminator']).join('.'),
          message: 'Discriminator must be of type object'
        });
        return;
      }

      // If discriminator propertyName is not a string, error out and return
      const { propertyName } = discriminator;
      if (typeof propertyName !== 'string') {
        errors.push({
          path: basePath
            .concat([schemaName, 'discriminator', 'propertyName'])
            .join('.'),
          message:
            '`propertName` inside discriminator object must be of type string'
        });
        return;
      }

      // If the schema's property doesn't include propertyName defined in discriminator, error out and return
      const { properties } = schema;
      if (!has(properties, propertyName)) {
        errors.push({
          path: basePath
            .concat([schemaName, 'discriminator', 'propertyName'])
            .join('.'),
          message:
            'The discriminator property name used must be defined in this schema'
        });
        return;
      }
    }
  });
  return { errors, warnings };
};
