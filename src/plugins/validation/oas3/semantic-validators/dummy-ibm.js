/* eslint-disable */

const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec }, config) {

  const messages = new MessageCarrier();

  // use the appropriate validation category object
  // ex) `config = config.operations` for the operations validator

/*
  config = config.category
*/



  // do stuff



  // error pushing format:

/*
  messages.addMessage(
    path to error either as an array or string,
    message about the error/warning,
    config.custom_rule_name OR 'error' OR 'warning
  )
*/

  return messages;
}
