// Walks an entire spec.

// Assertation 1:
// `type` values for properties must be strings
// multi-type properties are not allowed

// Assertation 2:
// In specific areas of a spec, allowed $ref values are restricted.
// [Removed]

// Assertation 3:
// Sibling keys with $refs are not allowed - default set to `off`
// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#sibling-elements-for-refs

const { walk } = require('../../../utils');
const MessageCarrier = require('../../../utils/message-carrier');

module.exports.validate = function({ jsSpec, isOAS3 }) {
  const messages = new MessageCarrier();

  walk(jsSpec, [], function(obj, path) {
    // parent keys that allow non-string "type" properties. for example,
    // having a definition called "type" is allowed
    const allowedParents = isOAS3
      ? [
          'schemas',
          'properties',
          'responses',
          'parameters',
          'requestBodies',
          'headers',
          'securitySchemes'
        ]
      : [
          'definitions',
          'properties',
          'parameters',
          'responses',
          'securityDefinitions'
        ];

    ///// "type" should always have a string-type value, everywhere.
    if (obj.type && allowedParents.indexOf(path[path.length - 1]) === -1) {
      if (typeof obj.type !== 'string') {
        messages.addMessage(
          [...path, 'type'],
          '"type" should be a string',
          'error'
        );
      }
    }

    ///// Minimums and Maximums

    if (obj.maximum && obj.minimum) {
      if (greater(obj.minimum, obj.maximum)) {
        messages.addMessage(
          path.concat(['minimum']),
          'Minimum cannot be more than maximum',
          'error'
        );
      }
    }

    if (obj.maxProperties && obj.minProperties) {
      if (greater(obj.minProperties, obj.maxProperties)) {
        messages.addMessage(
          path.concat(['minProperties']),
          'minProperties cannot be more than maxProperties',
          'error'
        );
      }
    }

    if (obj.maxLength && obj.minLength) {
      if (greater(obj.minLength, obj.maxLength)) {
        messages.addMessage(
          path.concat(['minLength']),
          'minLength cannot be more than maxLength',
          'error'
        );
      }
    }
  });

  return messages;
};

function greater(a, b) {
  // is a greater than b?
  return a > b;
}
