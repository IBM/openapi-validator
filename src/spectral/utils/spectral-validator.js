const MessageCarrier = require('../../plugins/utils/messageCarrier');

const parseResults = function(results) {
  const messages = new MessageCarrier();

  if (results) {
    for (const validationResult of results) {
      if (validationResult) {
        const code = validationResult['code'];
        const severity = validationResult['severity'];
        const message = validationResult['message'];
        const path = validationResult['path'];

        if (code && severity != null && message && path) {
          if (code == 'parser') {
            // Spectral doesn't allow disabling parser rules, so don't include them
            // in the output for now
            continue;
          }
          // Our validator only supports warning/error level, so only include
          // those validation results (for now)
          if (severity == '1') {
            //warning
            messages.addMessage(path, message, 'warning');
          } else if (severity == '0') {
            //error
            messages.addMessage(path, message, 'error');
          }
        } else {
          console.error(
            'There was an error while parsing the spectral results: ',
            JSON.stringify(validationResult)
          );
          continue;
        }
      }
    }
  }
  return messages;
};

module.exports = {
  parseResults
};
