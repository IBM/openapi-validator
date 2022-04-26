// Assertation 1:
// The description, when present, should not be empty or contain empty space

// Assertation 2:
// Description siblings to $refs should not exist if identical to referenced description

const { walk } = require('../../../utils');
const MessageCarrier = require('../../../utils/message-carrier');

// Walks an entire spec.
module.exports.validate = function({ jsSpec }) {
  const messages = new MessageCarrier();

  walk(jsSpec, [], function(obj, path) {
    // check for and flag null values - they are not allowed by the spec and are likely mistakes
    Object.keys(obj).forEach(key => {
      if (
        key !== 'default' &&
        obj[key] === null &&
        path[path.length - 1] !== 'enum'
      ) {
        messages.addMessage(
          [...path, key],
          'Null values are not allowed for any property.',
          'error'
        );
      }
    });
  });

  return messages;
};
