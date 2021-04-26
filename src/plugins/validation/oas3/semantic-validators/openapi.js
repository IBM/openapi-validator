// Assertation 1:
// check if openapi field exist

// Assertation 2:
// make sure the field is of type string

// Assertation 3:
// make sure the string follows semantic versioning 2.0.0

const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec }) {
  const messages = new MessageCarrier();

  const openapi = jsSpec.openapi;

  if (!openapi) {
    messages.addMessage(
      ['openapi'],
      'API definition must have an `openapi` field',
      'error'
    );
  }
  return messages;
};
