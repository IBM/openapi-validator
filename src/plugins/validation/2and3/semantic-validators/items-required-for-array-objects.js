// Assertation 1:
// The items property for Schema Objects, or schema-like objects (non-body parameters), is required when type is set to array

// Assertation 2:
// The required properties for a Schema Object must be defined in the object or one of its ancestors.

// Assertation 3
// (For Swagger 2 specs. In the OAS 3 spec, headers do not have types. Their schemas will be checked by Assertation 1):
// Headers with 'array' type require an 'items' property

const { walk } = require('../../../utils');
const MessageCarrier = require('../../../utils/messageCarrier');
const isPlainObject = require('lodash/isPlainObject');

module.exports.validate = function({ jsSpec }) {
  const messages = new MessageCarrier();

  walk(jsSpec, [], function(obj, path) {
    // `definitions` for Swagger 2, `schemas` for OAS 3
    // `properties` applies to both
    const modelLocations = ['definitions', 'schemas', 'properties'];
    const current = path[path.length - 1];

    if (
      current === 'schema' ||
      modelLocations.indexOf(path[path.length - 2]) > -1
    ) {
      // if parent is 'schema', or we're in a model definition

      // Assertation 1
      if (obj.type === 'array' && !isPlainObject(obj.items)) {
        messages.addMessage(
          path.join('.'),
          "Schema objects with 'array' type require an 'items' property",
          'error'
        );
      }
    }

    // this only applies to Swagger 2
    if (path[path.length - 2] === 'headers') {
      if (obj.type === 'array' && !isPlainObject(obj.items)) {
        messages.addMessage(
          path,
          "Headers with 'array' type require an 'items' property",
          'error'
        );
      }
    }
  });

  return messages;
};
