// Assertation 1:
// check if info exists

// Assertation 2:
// making sure that the required version and title are defined properly

const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec }) {
  const messages = new MessageCarrier();

  const info = jsSpec.info;
  const hasInfo = info && typeof info === 'object';
  if (!hasInfo) {
    messages.addMessage(
      ['info'],
      'API definition must have an `info` object',
      'error'
    );
  } else {
    const title = jsSpec.info.title;
    const hasTitle =
      typeof title === 'string' && title.toString().trim().length > 0;
    const version = jsSpec.info.version;
    const hasVersion =
      typeof version === 'string' && version.toString().trim().length > 0;

    if (!hasTitle) {
      messages.addMessage(
        ['info', 'title'],
        '`info` object must have a string-type `title` field',
        'error'
      );
    } else if (!hasVersion) {
      messages.addMessage(
        ['info', 'version'],
        '`info` object must have a string-type `version` field',
        'error'
      );
    }
  }
  return messages;
};
