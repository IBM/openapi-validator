// Assertation 1:
// if discriminator exist inside schema object, it must be of type Object

// Assertion 2:
// discriminator object must have a field name propertyName

// Assertation 3:
// propertyName is of type string

// Assertation 4:
// properties inside a schema object must include propertyName from discriminator object

const each = require('lodash/each');
const has = require('lodash/has');
const get = require('lodash/get');
const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec }) {
  const messages = new MessageCarrier();

  const schemas = get(jsSpec, ['components', 'schemas'], []);

  const basePath = ['components', 'schemas'];

  each(schemas, (schema, schemaName) => {
    if (has(schema, 'discriminator')) {
      const { discriminator } = schema;

      // If discriminator is not an object, error out and return
      if (typeof discriminator === 'object') {
        if (!has(discriminator, 'propertyName')) {
          messages.addMessage(
            basePath.concat([schemaName, 'discriminator']).join('.'),
            'Discriminator must be of type object with field name propertyName',
            'error'
          );
          return;
        }
      } else {
        messages.addMessage(
          basePath.concat([schemaName, 'discriminator']).join('.'),
          'Discriminator must be of type object',
          'error'
        );
        return;
      }

      // If discriminator propertyName is not a string, error out and return
      const { propertyName } = discriminator;
      if (typeof propertyName !== 'string') {
        messages.addMessage(
          basePath
            .concat([schemaName, 'discriminator', 'propertyName'])
            .join('.'),
          '`propertyName` inside discriminator object must be of type string',
          'error'
        );
        return;
      }

      // If the schema's property doesn't include propertyName defined in discriminator, error out and return
      const { properties } = schema;
      if (!has(properties, propertyName)) {
        messages.addMessage(
          basePath
            .concat([schemaName, 'discriminator', 'propertyName'])
            .join('.'),
          'The discriminator property name used must be defined in this schema',
          'error'
        );
        return;
      }
    }
  });
  return messages;
};
