// Assertation 1:
// The items property for a parameter is required when its type is set to array

const { isParameterObject, walk } = require('../../../utils');
const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ resolvedSpec }) {
  const messages = new MessageCarrier();

  walk(resolvedSpec, [], (obj, path) => {
    const isContentsOfParameterObject = isParameterObject(path, false); // 2nd arg is isOAS3

    // 1
    if (isContentsOfParameterObject) {
      if (obj.type === 'array' && typeof obj.items !== 'object') {
        messages.addMessage(
          path,
          "Parameters with 'array' type require an 'items' property.",
          'error'
        );
      }
    }
  });

  return messages;
};
