// Assertation 1:
// if discriminator exist inside schema object, it must be of type Object
// enforced by Spectral's oas3-schema rule

// Assertion 2:
// discriminator object must have a field name propertyName
// enforced by Spectral's oas3-schema rule

// Assertation 3:
// propertyName is of type string
// enforced by Spectral's oas3-schema rule

// Assertation 4:
// properties inside a schema object must include propertyName from discriminator object

const each = require('lodash/each');
const has = require('lodash/has');
const get = require('lodash/get');
const isPlainObject = require('lodash/isPlainObject');
const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec }) {
  const messages = new MessageCarrier();

  const schemas = get(jsSpec, ['components', 'schemas'], []);

  const basePath = ['components', 'schemas'];

  each(schemas, (schema, schemaName) => {
    if (has(schema, 'discriminator')) {
      const { discriminator } = schema;

      if (!isPlainObject(discriminator)) {
        return;
      }

      const { propertyName } = discriminator;
      // If the schema's property doesn't include propertyName defined in discriminator, add error and return
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
