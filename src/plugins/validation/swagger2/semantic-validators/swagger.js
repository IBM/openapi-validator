// Assertation 1:
// check if swagger field exist

// Assertation 2:
// make sure the swagger field is of type string

// Assertation 3:
// make sure the value of swagger field must be "2.0"

const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec }) {
  const messages = new MessageCarrier();

  const swagger = jsSpec.swagger;

  if (!swagger) {
    messages.addMessage(
      ['swagger'],
      'API definition must have an `swagger` field',
      'error'
    );
  } else if (typeof swagger !== 'string') {
    messages.addMessage(
      ['swagger'],
      'API definition must have an `swagger` field as type string',
      'error'
    );
  } else if (swagger !== '2.0') {
    messages.addMessage(
      ['swagger'],
      '`swagger` string must have the value `2.0`',
      'error'
    );
  }
  return messages;
};
