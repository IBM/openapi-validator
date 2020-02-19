// Assertation 1:
// if discriminator exist inside schema object, it must be of type string

// Assertation 2:
// properties inside a schema object must include property defined by discriminator

// Assertation 3:
// required inside a schema must be an array

// Assertation 4:
// the schema must also list discriminator value as part of required

const each = require('lodash/each');
const has = require('lodash/has');
const get = require('lodash/get');
const includes = require('lodash/includes');
const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec }) {
  const messages = new MessageCarrier();

  const schemas = get(jsSpec, ['definitions'], []);

  const basePath = ['definitions'];

  each(schemas, (schema, schemaName) => {
    if (has(schema, 'discriminator')) {
      const { discriminator } = schema;

      // If discriminator is not an string, error out and return
      if (typeof discriminator !== 'string') {
        messages.addMessage(
          basePath.concat([schemaName, 'discriminator']).join('.'),
          'Discriminator must be of type string',
          'error'
        );
        return;
      }

      // If the schema's property doesn't include property defined in discriminator, error out and return
      const { properties } = schema;
      if (!has(properties, discriminator)) {
        messages.addMessage(
          basePath.concat([schemaName, 'discriminator']).join('.'),
          'The discriminator defined must also be defined as a property in this schema',
          'error'
        );
        return;
      }

      // required must exist
      const { required } = schema;

      if (!required) {
        messages.addMessage(
          basePath.concat([schemaName]).join('.'),
          'Required array not found. The discriminator defined must also be part of required properties',
          'error'
        );
        return;
      }

      // required must be an array
      if (!(required instanceof Array)) {
        messages.addMessage(
          basePath.concat([schemaName, 'required']).join('.'),
          'Required must be an array',
          'error'
        );
        return;
      }

      // discriminator must be in required
      if (!includes(required, discriminator)) {
        messages.addMessage(
          basePath.concat([schemaName, 'required']).join('.'),
          'Discriminator is not listed as part of required',
          'error'
        );
      }
    }
  });
  return messages;
};
