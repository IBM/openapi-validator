// Assertation 1:
// if discriminator exist inside schema object, it must be of type string

// Assertation 2:
// properties inside a schema object must include property defined by discriminator

// Assertation 3:
// required inside a schema must be an array

// Assertation 3:
// the schema must also list discriminator value as part of required

const each = require('lodash/each');
const has = require('lodash/has');
const get = require('lodash/get');
const includes = require('lodash/includes');

module.exports.validate = function({ jsSpec }) {
  const errors = [];
  const warnings = [];

  const schemas = get(jsSpec, ['definitions'], []);

  const basePath = ['definitions'];

  each(schemas, (schema, schemaName) => {
    if (has(schema, 'discriminator')) {
      const { discriminator } = schema;

      // If discriminator is not an string, error out and return
      if (typeof discriminator !== 'string') {
        errors.push({
          path: basePath.concat([schemaName, 'discriminator']).join('.'),
          message: 'Discriminator must be of type string'
        });
        return;
      }

      // If the schema's property doesn't include property defined in discriminator, error out and return
      const { properties } = schema;
      if (!has(properties, discriminator)) {
        errors.push({
          path: basePath.concat([schemaName, 'discriminator']).join('.'),
          message:
            'The discriminator defined must also be defined as a property in this schema'
        });
        return;
      }

      // required must exist
      const { required } = schema;

      if (!required) {
        errors.push({
          path: basePath.concat([schemaName]).join('.'),
          message:
            'Required array not found. The discriminator defined must also be part of required properties'
        });
        return;
      }

      // required must be an array
      if (!(required instanceof Array)) {
        errors.push({
          path: basePath.concat([schemaName, 'required']).join('.'),
          message: 'Required must be an array'
        });
        return;
      }

      // discriminator must be in required
      if (!includes(required, discriminator)) {
        errors.push({
          path: basePath.concat([schemaName, 'required']).join('.'),
          message: 'Discriminator is not listed as part of required'
        });
      }
    }
  });
  return { errors, warnings };
};
