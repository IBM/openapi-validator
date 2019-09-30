// Assertation 1:
// if discriminator exist inside schema object, it must be of type string

// Assertation 2:
// properties inside a schema object must include property defined by discriminator

const each = require('lodash/each');
const has = require('lodash/has');

module.exports.validate = function({ jsSpec }) {
  const errors = [];
  const warnings = [];

  const schemas = jsSpec.components.schemas;

  const basePath = ['components', 'schemas'];

  each(schemas, (schema, schemaName) => {
    if (has(schema, 'discriminator')) {
      const { discriminator } = schema;

      // If discriminator is not an string, error out and return
      if (typeof discriminator !== 'string') {
          errors.push({
            path: basePath.concat([schemaName, 'discriminator']).join('.'),
            message:
              'Discriminator must be of type string'
          });
          return;
      }

      // If the schema's property doesn't include property defined in discriminator, error out and return
      const { properties } = schema;
      if (!has(properties, discriminator)) {
        errors.push({
          path: basePath
            .concat([schemaName, 'discriminator'])
            .join('.'),
          message:
            'The discriminator defined must also be defined as a property in this schema'
        });
        return;
      }
    }
  });
  return { errors, warnings };
};
